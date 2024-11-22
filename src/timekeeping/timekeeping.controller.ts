import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { TimekeepingService } from './timekeeping.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserRequestInfo } from 'src/users/users.decorator';

@Controller('timekeeping')
export class TimekeepingController {
  constructor(private readonly timekeepingService: TimekeepingService) {}

  @UseGuards(AuthGuard)
  @Get('user')
  async getTimekeepingByEmployee(@UserRequestInfo() user: any): Promise<any> {
    return this.timekeepingService.getTimekeepingByEmployee(user.id);
  }

  @UseGuards(AuthGuard)
  @Post('check-in')
  async checkIn(@UserRequestInfo() user: any) {
    return this.timekeepingService.checkIn(user.id);
  }

  @UseGuards(AuthGuard)
  @Post('check-out')
  async checkOut(@UserRequestInfo() user: any) {
    return this.timekeepingService.checkOut(user.id);
  }

  @Get('monthly-report/:user_id')
  async getMonthlyReport(
    @Param('user_id') user_id: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.timekeepingService.getMonthlyReport(user_id, month, year);
  }

  @Get('yearly-report/:user_id')
  async getYearlyReport(@Param('user_id') user_id: number) {
    return this.timekeepingService.getYearlyReport(user_id);
  }
}
