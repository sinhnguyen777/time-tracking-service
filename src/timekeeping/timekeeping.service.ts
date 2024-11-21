import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { Timekeeping } from 'src/shared/schema/timekeeping.schema';

@Injectable()
export class TimekeepingService {
  constructor(
    @InjectModel(Timekeeping.name) private timekeepingModel: Model<Timekeeping>,
  ) {}

  // Check-in
  async checkIn(user_id: number): Promise<Timekeeping> {
    try {
      const today = dayjs().startOf('day'); // Bắt đầu ngày hiện tại
      const tomorrow = dayjs().endOf('day'); // Kết thúc ngày hiện tại

      const existingRecord = await this.timekeepingModel.findOne({
        user_id,
        date: { $gte: today.toDate(), $lte: tomorrow.toDate() },
      });

      if (existingRecord) {
        throw new Error('You have already checked in today');
      }

      const newCheckIn = new this.timekeepingModel({
        user_id,
        date: today.toDate(),
        time_check_in: new Date(),
        status: 'working',
      });

      return newCheckIn.save();
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }

  // Check-out
  async checkOut(user_id: number): Promise<Timekeeping> {
    try {
      const today = dayjs().startOf('day');
      const tomorrow = dayjs().endOf('day');

      const record = await this.timekeepingModel.findOne({
        user_id,
        date: { $gte: today.toDate(), $lte: tomorrow.toDate() },
      });

      if (!record) {
        throw new Error('You need to check-in first');
      }

      const checkOutTime = dayjs();
      const lateMinutes = Math.max(
        0,
        checkOutTime.diff(dayjs().hour(17).minute(0), 'minute'), // Giờ kết thúc làm việc là 17:00
      );

      record.time_check_out = checkOutTime.toDate();
      record.status = lateMinutes > 0 ? 'late' : 'working';
      record.late_minutes = lateMinutes;

      return record.save();
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }

  // Thống kê lịch trình trong 1 tháng
  async getMonthlyReport(user_id: number, month: number, year: number) {
    try {
      const startDate = dayjs()
        .year(year)
        .month(month - 1)
        .startOf('month');
      const endDate = dayjs()
        .year(year)
        .month(month - 1)
        .endOf('month');

      const records = await this.timekeepingModel.find({
        user_id,
        date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      });

      const totalWorkingDays = records.filter(
        (record) => record.status === 'working',
      ).length;
      const totalLateDays = records.filter(
        (record) => record.status === 'late',
      ).length;
      const totalAbsentDays = records.filter(
        (record) => record.status === 'absent',
      ).length;
      const totalLateMinutes = records.reduce(
        (sum, record) => sum + record.late_minutes,
        0,
      );

      return {
        data: {
          totalWorkingDays,
          totalLateDays,
          totalAbsentDays,
          totalLateMinutes,
          records,
        },
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }

  // Thống kê 12 tháng gần nhất
  async getYearlyReport(user_id: number) {
    try {
      const now = dayjs();
      const oneYearAgo = dayjs().subtract(12, 'month').startOf('month');

      const records = await this.timekeepingModel.find({
        user_id,
        date: { $gte: oneYearAgo.toDate(), $lte: now.toDate() },
      });

      const monthlyStats = Array.from({ length: 12 }, (_, i) => {
        const monthStart = now.subtract(i, 'month').startOf('month');
        const monthEnd = now.subtract(i, 'month').endOf('month');

        const monthlyRecords = records.filter(
          (record) =>
            dayjs(record.date).isSameOrAfter(monthStart) &&
            dayjs(record.date).isSameOrBefore(monthEnd),
        );

        const totalWorkingDays = monthlyRecords.filter(
          (record) => record.status === 'working',
        ).length;
        const totalLateDays = monthlyRecords.filter(
          (record) => record.status === 'late',
        ).length;
        const totalLateMinutes = monthlyRecords.reduce(
          (sum, record) => sum + record.late_minutes,
          0,
        );
        const totalAbsentDays = monthlyRecords.filter(
          (record) => record.status === 'absent',
        ).length;

        return {
          month: monthStart.format('MMMM YYYY'),
          totalWorkingDays,
          totalLateDays,
          totalLateMinutes,
          totalAbsentDays,
        };
      });

      return {
        data: monthlyStats.reverse(), // Trả về theo thứ tự từ xa đến gần
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }
}
