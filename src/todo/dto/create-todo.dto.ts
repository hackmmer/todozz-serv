import { IWorkspace } from 'src/workspace/entities/workspace.entity';
import { ITask } from '../entities/todo.entity';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
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
  @IsArray()
  @IsOptional()
  checkers?: ITask[];
}
