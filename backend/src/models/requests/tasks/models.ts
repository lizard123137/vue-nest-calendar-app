import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskRequest {
  @ApiProperty({ example: '2025-06-01T12:00:00Z' })
  date: Date;

  @ApiProperty({ example: 'Do something!' })
  description: string;
}
