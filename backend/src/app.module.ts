import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksController } from './controllers/tasks/tasks.controller';
import { TasksService } from './services/tasks/tasks.service';

@Module({
  imports: [],
  controllers: [AppController, TasksController],
  providers: [AppService, TasksService],
})
export class AppModule {}
