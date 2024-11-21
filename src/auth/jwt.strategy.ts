import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'your_secret_key', // Đổi thành secret thực tế
  signOptions: { expiresIn: '1h' }, // Token hết hạn sau 1 giờ
};
