import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  // IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  // @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  code: string; // Thêm trường `code` vào DTO

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  @Matches(/^\d{10,11}$/, { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @IsNotEmpty()
  position: string;

  @IsNumber()
  id_role: number; // ID của vai trò
}
