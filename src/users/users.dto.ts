import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(['employee', 'manager', 'HR'])
  role: 'employee' | 'manager' | 'HR';
}
