import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(['employee', 'manager', 'HR'])
  role: 'employee' | 'manager' | 'HR';
}
