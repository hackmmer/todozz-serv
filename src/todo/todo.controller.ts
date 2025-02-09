import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';
import { IUser } from 'src/users/entities/user.entity';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: Request, @Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(req.user as IUser, createTodoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    // console.log(updateTodoDto);
    // return this.todoService.update(id, updateTodoDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('task/:token')
  updateTask(
    @Param('token') token: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.todoService.updateTask(token, updateTaskDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }
}
