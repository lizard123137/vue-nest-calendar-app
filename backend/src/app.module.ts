import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksController } from './controllers/tasks/tasks.controller';
import { TasksService } from './services/tasks/tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './models/schemas/task.schema';
import { User, UserSchema } from './models/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://host.docker.internal:27017/calendar'),
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AppController, TasksController],
  providers: [AppService, TasksService],
})
export class AppModule {}
