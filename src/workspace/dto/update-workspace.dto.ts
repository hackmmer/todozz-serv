import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { ITodo } from 'src/todo/entities/todo.entity';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
  token: string;
  title: string;
  todos: ITodo[];
}
