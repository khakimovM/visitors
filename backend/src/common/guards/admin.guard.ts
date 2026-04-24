import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.userRole !== "ADMIN") {
      throw new ForbiddenException("Bu amalni faqat admin bajarishi mumkin");
    }
    return true;
  }
}
