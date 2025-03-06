import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { IsArray, IsObject } from 'class-validator';
import { ITodo } from 'src/todo/entities/todo.entity';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {

    @IsArray()
    @IsObject({each: true})
    todos: ITodo
}
