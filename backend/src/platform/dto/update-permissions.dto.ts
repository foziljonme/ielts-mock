import { IsString } from 'class-validator';

export class UpdatePermissionsDto {
  @IsString({
    each: true,
    message: 'Permissions must be strings',
  })
  permissions: string[];
}
