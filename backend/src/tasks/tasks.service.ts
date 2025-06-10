import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskRequest } from 'src/models/requests/tasks/models';
import { Task } from 'src/tasks/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async findByDate(dateFrom: Date, dateTo: Date): Promise<Task[]> {
    return this.taskModel
      .find({
        date: {
          $gte: dateFrom,
          $lte: dateTo,
        },
      })
      .exec();
  }

  async create(createTaskRequest: CreateTaskRequest): Promise<Task> {
    const createdTask = new this.taskModel(createTaskRequest);
    return createdTask.save();
  }
}
