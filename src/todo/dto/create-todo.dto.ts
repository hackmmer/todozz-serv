import { IWorkspace } from 'src/workspace/entities/workspace.entity';
import { ITask } from '../entities/todo.entity';
import {
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateTodoDto {
  @IsObject({
    always: false,
    message: 'Workspace should be a workspace or string',
  })
  @IsString({
    always: false,
    message: 'Workspace should be a workspace or string',
  })
  @IsOptional()
  workspace: IWorkspace | string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  token?: string;

  @ValidateNested({ each: true })
  @IsOptional()
  checkers?: ITask[];
}
