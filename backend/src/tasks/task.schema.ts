import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop()
  date: Date;

  @Prop()
  description: string;

  @Prop({ required: true })
  userId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
