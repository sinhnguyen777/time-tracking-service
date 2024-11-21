import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { TimekeepingService } from './timekeeping.service';

@Controller('timekeeping')
export class TimekeepingController {
  constructor(private readonly timekeepingService: TimekeepingService) {}

  @Post('check-in/:user_id')
  async checkIn(@Param('user_id') user_id: number) {
    return this.timekeepingService.checkIn(user_id);
  }

  @Post('check-out/:user_id')
  async checkOut(@Param('user_id') user_id: number) {
    return this.timekeepingService.checkOut(user_id);
  }

  @Get('monthly-report/:user_id')
  async getMonthlyReport(
    @Param('user_id') user_id: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.timekeepingService.getMonthlyReport(user_id, month, year);
  }
}
