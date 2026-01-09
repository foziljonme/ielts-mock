import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'prisma/generated/enums';

export class LoginDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

export class JoinByCodeDto {
  @IsString()
  @IsNotEmpty()
  accessCode: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;
}
