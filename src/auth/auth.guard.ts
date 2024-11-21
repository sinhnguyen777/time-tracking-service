/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException('Không tìm thấy token');
    }

    try {
      const decoded = this.jwtService.verify(token);
      const hasPermission = await this.authService.checkPermissions(
        decoded.sub,
        'required_permission_name', // Thay bằng quyền bạn muốn kiểm tra
      );

      return hasPermission;
    } catch (error) {
      throw new UnauthorizedException('Thông tin xác thực không hợp lệ');
    }
  }
}
