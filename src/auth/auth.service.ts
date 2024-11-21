import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    try {
      // Kiểm tra email đã tồn tại
      const existingUser = await this.usersService.getUserByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo người dùng
      const user = await this.usersService.createUser({
        ...registerDto,
        password: hashedPassword,
      });

      return { message: 'User registered successfully', user };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error registering user');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Tìm người dùng qua email
      const user = await this.usersService.getUserByEmail(email);

      console.log('user', user);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Kiểm tra mật khẩu
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Tạo JWT token
      // const payload = { sub: user._id, role: user.role };
      // const accessToken = this.jwtService.sign(payload);

      // return {
      //   accessToken,
      //   user: { id: user._id, name: user.name, role: user.role },
      // };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error logging in');
    }
  }
}
