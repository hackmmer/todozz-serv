import { IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  token: string;

  @IsString()
  title: string;
}
