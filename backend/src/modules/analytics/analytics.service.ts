import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getVisitors(from: Date, to: Date, userId: number, isAdmin: boolean, branchId?: number) {
    const userFilter = isAdmin
      ? branchId ? { userId: branchId } : {}
      : { userId };

    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const data = await this.prisma.traffic.groupBy({
      by: ["dateTime"],
      where: {
        ...userFilter,
        dateTime: {
          gte: fromDate,
          lte: toDate,
        },
      },
      _sum: {
        inCount: true,
        outCount: true,
      },
      orderBy: {
        dateTime: "asc",
      },
    });

    // Soat bo'yicha keladigan yozuvlarni sana bo'yicha birlashtirish
    const grouped = new Map<string, { totalIn: number; totalOut: number }>();
    for (const item of data) {
      const date = item.dateTime.toISOString().split("T")[0];
      const existing = grouped.get(date) ?? { totalIn: 0, totalOut: 0 };
      existing.totalIn += item._sum.inCount || 0;
      existing.totalOut += item._sum.outCount || 0;
      grouped.set(date, existing);
    }

    return Array.from(grouped.entries()).map(([date, sums]) => ({
      date,
      totalIn: sums.totalIn,
      totalOut: sums.totalOut,
    }));
  }

  async getTodayBranches(userId: number, isAdmin: boolean) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const userFilter = isAdmin ? { role: "USER" as const } : { id: userId };

    const users = await this.prisma.user.findMany({
      where: userFilter,
      select: { id: true, username: true },
    });

    const data = await this.prisma.traffic.groupBy({
      by: ["userId"],
      where: {
        dateTime: { gte: startOfToday, lte: endOfToday },
        userId: { in: users.map((u) => u.id) },
      },
      _sum: { inCount: true, outCount: true },
      orderBy: { userId: "asc" },
    });

    return users.map((user) => {
      const traffic = data.find((t) => t.userId === user.id);
      return {
        userId: user.id,
        username: user.username,
        inCount: traffic?._sum.inCount || 0,
        outCount: traffic?._sum.outCount || 0,
      };
    });
  }

  async getDayStatistics(day: Date, userId: number, isAdmin: boolean) {
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    const traffics = await this.prisma.traffic.findMany({
      where: {
        dateTime: { gte: startOfDay, lte: endOfDay },
        ...(isAdmin ? {} : { userId }),
      },
      select: {
        dateTime: true,
        inCount: true,
        outCount: true,
      },
    });

    const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      inCount: 0,
      outCount: 0,
    }));

    for (const t of traffics) {
      const hour = new Date(t.dateTime).getHours();
      hourlyStats[hour].inCount += t.inCount;
      hourlyStats[hour].outCount += t.outCount;
    }

    return hourlyStats;
  }

  async getAllBranches(userId: number, isAdmin: boolean) {
    const branches = await this.prisma.user.findMany({
      where: isAdmin ? { role: "USER" } : { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        traffics: {
          orderBy: { dateTime: "desc" },
          take: 1,
          select: { dateTime: true },
        },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // N+1 o'rniga bitta groupBy query
    const todayStats = await this.prisma.traffic.groupBy({
      by: ["userId"],
      where: {
        dateTime: { gte: today, lt: tomorrow },
        userId: { in: branches.map((b) => b.id) },
      },
      _sum: { inCount: true, outCount: true },
    });

    const statsMap = new Map(
      todayStats.map((s) => [s.userId, s._sum])
    );

    return branches.map((branch) => ({
      id: branch.id,
      name: branch.username,
      email: branch.email,
      lastActivity: branch.traffics[0]?.dateTime || null,
      inCount: statsMap.get(branch.id)?.inCount || 0,
      outCount: statsMap.get(branch.id)?.outCount || 0,
    }));
  }
}
