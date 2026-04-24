import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";
import { RedisService } from "src/core/database/redis.service";
import { CreateTrafficDto } from "./dto/traffic.dto";
import { CreateDeviceDto } from "./dto/create.device.dto";
import { UpdateDeviceDto } from "./dto/update.device.dto";
import { DeleteDeviceDto } from "./dto/delete.device.dto";

@Injectable()
export class TrafficService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createOrUpdateTraffic(dto: CreateTrafficDto) {
    const { device_id, in_count, out_count } = dto;

    const device = await this.prisma.device.findFirst({
      where: { deviceId: device_id },
      select: { userId: true },
    });

    if (!device) {
      throw new NotFoundException("Ushbu device_id bazada topilmadi");
    }

    const userId = device.userId;

    // Qurilmaning oxirgi kumulativ qiymatini Redis dan olish
    const redisKey = `device:cumulative:${device_id}`;
    const lastRaw = await this.redis.get(redisKey);
    const last: { in: number; out: number } = lastRaw
      ? JSON.parse(lastRaw)
      : { in: 0, out: 0 };

    // Delta hisoblash: agar yangi qiymat kichik bo'lsa — kun reset bo'lgan
    const deltaIn = in_count >= last.in ? in_count - last.in : in_count;
    const deltaOut = out_count >= last.out ? out_count - last.out : out_count;

    // Yangi kumulativ qiymatni Redis ga saqlash (25 soat TTL — kun reset himoyasi)
    await this.redis.set(
      redisKey,
      JSON.stringify({ in: in_count, out: out_count }),
      25 * 3600,
    );

    // Hech narsa o'zgarmagan bo'lsa skip
    if (deltaIn === 0 && deltaOut === 0) {
      return { message: "no change" };
    }

    // Joriy soatga truncate qilish
    const now = new Date();
    const dateTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      0,
      0,
      0,
    );

    const traffic = await this.prisma.traffic.upsert({
      where: { userId_dateTime: { userId, dateTime } },
      update: {
        inCount: { increment: deltaIn },
        outCount: { increment: deltaOut },
      },
      create: {
        userId,
        dateTime,
        inCount: deltaIn,
        outCount: deltaOut,
      },
    });

    return traffic;
  }

  async createDevice(userId: number, data: CreateDeviceDto) {
    const findAdmin = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!findAdmin) throw new NotFoundException("Admin not found");

    if (findAdmin.role === "USER")
      throw new ForbiddenException("faqat admin device qo'shish huquqiga ega");

    const findUser = await this.prisma.user.findFirst({
      where: { id: data.userId },
    });

    if (!findUser) throw new NotFoundException("Filial topilmadi");

    const findDevice = await this.prisma.device.findUnique({
      where: {
        userId_deviceId: {
          userId: data.userId,
          deviceId: data.deviceId,
        },
      },
    });

    if (findDevice)
      throw new ConflictException(
        "Filialga ushbu device oldin ro'yxatga olingan"
      );

    const newDevice = await this.prisma.device.create({ data });

    return { message: "success", newDevice };
  }

  async updateDevice(adminId: number, data: UpdateDeviceDto) {
    const { oldUserId, deviceId, newUserId } = data;

    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundException("Admin topilmadi");
    if (admin.role !== "ADMIN")
      throw new ForbiddenException("Faqat admin device yangilashi mumkin");

    const existingDevice = await this.prisma.device.findUnique({
      where: {
        userId_deviceId: {
          userId: oldUserId,
          deviceId: deviceId,
        },
      },
    });

    if (!existingDevice)
      throw new NotFoundException("Yangilanish uchun device topilmadi");

    if (newUserId && newUserId !== oldUserId) {
      const conflict = await this.prisma.device.findUnique({
        where: {
          userId_deviceId: {
            userId: newUserId,
            deviceId: deviceId,
          },
        },
      });

      if (conflict)
        throw new ConflictException(
          "Bu device allaqachon boshqa filialga biriktirilgan"
        );

      const updatedDevice = await this.prisma.device.update({
        where: { id: existingDevice.id },
        data: { userId: newUserId },
      });

      return {
        message: "Device muvaffaqiyatli yangilandi (filial o'zgartirildi)",
        updatedDevice,
      };
    }

    return {
      message: "Device allaqachon shu filialga biriktirilgan (o'zgarish yo'q)",
      device: existingDevice,
    };
  }

  async deleteDevice(adminId: number, data: DeleteDeviceDto) {
    const { deviceId, userId } = data;

    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundException("Admin topilmadi");
    if (admin.role !== "ADMIN")
      throw new ForbiddenException("Faqat admin device o'chirishi mumkin");

    const existingDevice = await this.prisma.device.findUnique({
      where: {
        userId_deviceId: {
          userId,
          deviceId,
        },
      },
    });

    if (!existingDevice)
      throw new NotFoundException("Filialda bunday device topilmadi");

    await this.prisma.device.delete({
      where: { id: existingDevice.id },
    });

    return {
      message: "Device muvaffaqiyatli o'chirildi!",
      deletedDeviceId: deviceId,
    };
  }

  async getAllDevices(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

    if (user.role === "ADMIN") {
      const devices = await this.prisma.device.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { id: "asc" },
      });

      return {
        message: "Barcha devicelar ro'yxati",
        count: devices.length,
        devices,
      };
    }

    const userDevices = await this.prisma.device.findMany({
      where: { userId },
      orderBy: { id: "asc" },
    });

    return {
      message: "Sizga tegishli devicelar ro'yxati",
      count: userDevices.length,
      devices: userDevices,
    };
  }
}
