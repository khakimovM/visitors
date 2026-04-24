import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { Request } from "express";
import { AuthGuard } from "src/common/guards/auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { VisitorsQueryDto, DayQueryDto } from "./dto/analytics-query.dto";

@Controller("analytics")
@ApiTags("Analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @Get("visitors")
  async getVisitors(@Query() query: VisitorsQueryDto, @Req() req: Request) {
    const isAdmin = req["userRole"] === "ADMIN";
    return await this.analyticsService.getVisitors(
      query.from,
      query.to,
      req["userId"],
      isAdmin,
      query.branchId,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @Get("today-branches")
  async getTodayBranches(@Req() req: Request) {
    const isAdmin = req["userRole"] === "ADMIN";
    return await this.analyticsService.getTodayBranches(req["userId"], isAdmin);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @Get("day-statistics")
  async getDayStatistics(@Query() query: DayQueryDto, @Req() req: Request) {
    const isAdmin = req["userRole"] === "ADMIN";
    return await this.analyticsService.getDayStatistics(query.day, req["userId"], isAdmin);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth("token")
  @Get("branches")
  async getAllBranches(@Req() req: Request) {
    const isAdmin = req["userRole"] === "ADMIN";
    return await this.analyticsService.getAllBranches(req["userId"], isAdmin);
  }
}
