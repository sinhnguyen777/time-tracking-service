import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Permission,
  PermissionSchema,
} from 'src/shared/schema/permissions.schema';
import { Role, RoleSchema } from 'src/shared/schema/roles.schema';
import { User, UserSchema } from 'src/shared/schema/users.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConfig } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // UsersService,
    // AuthGuard, // Thêm AuthGuard
    // JwtService, // Thêm JwtService nếu chưa có
  ],
  exports: [JwtModule],
})
export class AuthModule {}
