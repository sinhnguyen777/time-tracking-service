import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRequestInfo } from './users.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<any> {
    return this.usersService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get('user-info')
  getUserInfo(@UserRequestInfo() user: any): Promise<any> {
    return this.usersService.getUserInfo(user.id);
  }
}
