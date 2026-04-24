import { Module } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { AnalyticsController } from "./analytics.controller";
import { AdminGuard } from "src/common/guards/admin.guard";

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, AdminGuard],
})
export class AnalyticsModule {}
