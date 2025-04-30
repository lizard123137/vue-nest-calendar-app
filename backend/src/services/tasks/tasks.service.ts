import { Injectable } from '@nestjs/common';
import { Task } from 'src/entities/tasks/task';

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];

  // TODO select by date from - to
  findAll(): Task[] {
    return this.tasks;
  }

  create(task: Task) {
    this.tasks.push(task);
  }
}
