import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}
  async onModuleInit() {
    try {
      await this.seedAdmin();
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async seedAdmin() {
    const email = this.configService.get<string>("SP_EMAIL");
    const password = this.configService.get<string>("SP_PASSWORD");
    const username = this.configService.get<string>("SP_USERNAME");

    if (!email || !password || !username) {
      this.logger.error(
        "Admin seeder o'tkazib yuborildi: SP_EMAIL, SP_PASSWORD yoki SP_USERNAME env o'zgaruvchilari topilmadi"
      );
      return;
    }

    const findAdmin = await this.prisma.user.findFirst({ where: { email } });

    if (!findAdmin) {
      this.logger.log("Admin seeder boshlandi");
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.prisma.user.create({
        data: { email, password: hashedPassword, username, role: "ADMIN" },
      });
      this.logger.log("Admin muvaffaqiyatli yaratildi");
    } else {
      this.logger.warn("Admin allaqachon mavjud!");
    }
  }
}
