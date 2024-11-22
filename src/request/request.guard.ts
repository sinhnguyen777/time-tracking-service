import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class RequestGuard extends AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Lấy thông tin người dùng từ JWT payload
    const { id_employee } = request.params; // Lấy ID nhân viên từ URL

    console.log('user.id', user.id);
    console.log('id_employee', id_employee);

    // Kiểm tra xem người dùng có phải là nhân viên đó không (kiểm tra quyền truy cập)
    if (user.id !== parseInt(id_employee)) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập vào yêu cầu này',
      );
    }

    const isAuthenticated = await super.canActivate(context); // Kiểm tra xác thực JWT
    return isAuthenticated;
  }
}
