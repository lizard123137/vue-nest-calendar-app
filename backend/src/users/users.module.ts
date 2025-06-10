import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://host.docker.internal:27017/calendar'),
    MongooseModule.forFeature([]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
