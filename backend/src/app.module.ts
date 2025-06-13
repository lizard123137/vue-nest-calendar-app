import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './tasks/task.schema';
import { User, UserSchema } from './users/user.schema';
import { AuthService } from './services/auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://host.docker.internal:27017/calendar'),
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
  controllers: [AppController, TasksController],
  providers: [AppService, AuthService, TasksService, JwtService],
})
export class AppModule { }
