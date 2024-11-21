import { Module } from '@nestjs/common';
import { TimekeepingService } from './timekeeping.service';
import { TimekeepingController } from './timekeeping.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Timekeeping,
  TimekeepingSchema,
} from 'src/shared/schema/timekeeping.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Timekeeping.name, schema: TimekeepingSchema },
    ]),
  ],
  controllers: [TimekeepingController],
  providers: [TimekeepingService],
})
export class TimekeepingModule {}
