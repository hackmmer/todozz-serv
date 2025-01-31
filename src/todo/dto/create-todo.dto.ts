import { IWorkspace } from 'src/workspace/entities/workspace.entity';
import { ITask } from '../entities/todo.entity';

export class CreateTodoDto {
  workspace: IWorkspace | string;

  title: string;
  description?: string;
  token?: string;
  checkers?: ITask[];
}
