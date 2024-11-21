import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<any> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUserDetail(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  updateUserById(@Param('id') id: string, @Body() user: UserDto) {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  removeUserById(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
