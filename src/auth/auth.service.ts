import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/shared/schema/users.schema';
import { Role } from 'src/shared/schema/roles.schema';
import { Permission } from 'src/shared/schema/permissions.schema';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    private readonly jwtService: JwtService,
  ) {}

  private async generateUserId(): Promise<number> {
    const lastUser = await this.userModel.findOne().sort({ id: -1 }).exec();

    return lastUser ? lastUser.id + 1 : 1;
  }

  async checkPermissions(
    userId: number,
    requiredPermission: string,
  ): Promise<boolean> {
    try {
      const user = await this.userModel.findOne({ id: userId }).exec();
      if (!user) {
        throw new NotFoundException('Không tìm thấy người dùng');
      }

      const role = await this.roleModel.findOne({ id: user.id_role }).exec();
      if (!role) {
        throw new ForbiddenException('Người dùng không có quyền truy cập');
      }

      const permission = await this.permissionModel
        .findOne({ id: role.id_permission })
        .exec();
      if (!permission || permission.name !== requiredPermission) {
        throw new ForbiddenException(
          'Không đủ quyền để thực hiện thao tác này',
        );
      }

      return true;
    } catch {
      throw new NotFoundException('Không có quyền truy cập');
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email }).exec();
      if (!user) {
        throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
      }

      const role = await this.roleModel.findOne({ id: user.id_role }).exec();
      if (!role) {
        throw new ForbiddenException('Người dùng không có quyền truy cập');
      }

      const permission = await this.permissionModel
        .findOne({ id: role.id_permission })
        .exec();
      if (!permission) {
        throw new ForbiddenException('Không tìm thấy quyền tương ứng');
      }

      // Tạo JWT token
      const payload = {
        email: user.email,
        sub: user.id,
        role: role.id,
        permissions: permission.name,
      };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Đăng nhập thất bại');
    }
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    try {
      const { email, password, full_name, phone, position, id_role, code } =
        registerDto;

      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        throw new Error('Email đã được sử dụng');
      }

      const existingUserCodeDuplicate = await this.userModel
        .findOne({ code })
        .exec();
      if (existingUserCodeDuplicate) {
        throw new Error('Mã nhân viên đã được sử dụng');
      }

      const roleExists = await this.roleModel
        .findOne({ id_permission: id_role })
        .exec();
      if (!roleExists) {
        throw new Error('Vai trò không hợp lệ');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.userModel({
        id: await this.generateUserId(),
        email,
        password: hashedPassword,
        full_name,
        phone,
        position,
        id_role,
        code,
      });

      console.log('newUser', newUser);

      await newUser.save();

      return { message: 'Đăng ký thành công' };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
