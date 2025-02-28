import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  profile_image?: string;

  @IsString()
  username: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
