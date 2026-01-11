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
}

export class CandidateLoginDto {
  @IsString()
  @IsNotEmpty()
  accessCode: string;

  @IsString()
  @IsNotEmpty()
  candidateId: string;
}
