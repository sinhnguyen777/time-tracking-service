import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: 'your_secret_key', // Đổi thành secret thực tế
  signOptions: { expiresIn: '7d' }, // Token hết hạn sau 7 ngày
};
