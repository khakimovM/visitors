import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { CoreModule } from "./core/core.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { TrafficModule } from "./modules/traffic/traffic.module";

@Module({
  imports: [CoreModule, AuthModule, UserModule, AnalyticsModule, TrafficModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
