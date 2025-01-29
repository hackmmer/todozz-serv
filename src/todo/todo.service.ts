import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { merge } from 'lodash';

@Injectable()
export class TodoService {

  todos: Todo[] = [];

  create(createTodoDto: CreateTodoDto) {
    return this.todos.push(new Todo(createTodoDto))
  }

  findAll() {
    return this.todos;
  }

  findOne(id: string) {
    return this.todos.find(e => e._id === id);
  }

  update(id: string, updateTodoDto: UpdateTodoDto) {
    const i = this.todos.findIndex(e => e._id === id)
    merge(this.todos[i], updateTodoDto)
    return this.todos[i];
  }

  remove(id: string) {
    const i = this.todos.findIndex(e => e._id === id)
    const u = this.todos.slice(i, i);
    return u;
  }
}
