import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { CreateTaskRequest } from 'src/models/requests/tasks/models';
import { Task } from 'src/models/schemas/task.schema';
import { TasksService } from 'src/services/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiQuery({
    name: 'dateFrom',
    required: true,
    type: String,
    example: '2025-05-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'dateTo',
    required: true,
    type: String,
    example: '2025-07-01T00:00:00Z',
  })
  async findByDate(
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ): Promise<Task[]> {
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    return this.tasksService.findByDate(startDate, endDate);
  }

  @Post()
  async create(@Body() createTaskRequest: CreateTaskRequest): Promise<Task> {
    return this.tasksService.create(createTaskRequest);
  }
}
