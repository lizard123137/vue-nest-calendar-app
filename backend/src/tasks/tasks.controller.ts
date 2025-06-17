import { Body, Controller, Get, Post, Request, Query, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskRequest } from 'src/models/requests/tasks/models';
import { Task } from 'src/tasks/task.schema';
import { TasksService } from 'src/tasks/tasks.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

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
    @Request() req: Request,
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ): Promise<Task[]> {
    const userId = req.user.userId;
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    return this.tasksService.findByDate(startDate, endDate, userId);
  }

  @Post()
  async create(
    @Request() req: Request,
    @Body() createTaskRequest: CreateTaskRequest
  ): Promise<Task> {
    const userId = req.user.userId;
    return this.tasksService.create({ ...createTaskRequest, userId });
  }
}
