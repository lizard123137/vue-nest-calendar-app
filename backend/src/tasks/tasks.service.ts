import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskRequest } from 'src/models/requests/tasks/models';
import { Task } from 'src/tasks/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) { }

  async findByDate(dateFrom: Date, dateTo: Date, userId: string): Promise<Task[]> {
    return this.taskModel
      .find({
        date: {
          $gte: dateFrom,
          $lte: dateTo,
        },
        userId,
      })
      .exec();
  }

  async create(data: CreateTaskRequest & { userId: string }): Promise<Task> {
    const createdTask = new this.taskModel(data);
    return createdTask.save();
  }
}
