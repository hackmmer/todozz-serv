import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IWorkspace } from 'src/workspace/entities/workspace.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  profile_image?: string;
  name: string;
  password: string;
  workspaces: IWorkspace[];
}
