import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split('Bearer ')[1];

    if (!token) {
      throw new ForbiddenException('Không tìm thấy token');
    }

    try {
      // Xác thực token
      const decoded = this.jwtService.verify(token);

      // Gắn thông tin user vào request
      request.user = {
        id: decoded.sub,
        role: decoded.role,
      };

      const requiredRoles = this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );

      if (requiredRoles?.length) {
        if (!requiredRoles.includes(decoded.role)) {
          throw new ForbiddenException('Bạn không có quyền truy cập');
        }
      }

      return true;
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException('Thông tin xác thực không hợp lệ');
    }
  }
}
