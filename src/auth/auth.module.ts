import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConfig } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/shared/schema/users.schema';
import { Role, RoleSchema } from 'src/shared/schema/roles.schema';
import {
  Permission,
  PermissionSchema,
} from 'src/shared/schema/permissions.schema';

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
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
