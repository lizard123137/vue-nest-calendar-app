import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from 'src/entities/tasks/models';
import { Task } from 'src/entities/tasks/task';
import { TasksService } from 'src/services/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    this.tasksService.create(createTaskDto);
  }
}
