import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';

import { Timekeeping } from 'src/shared/schema/timekeeping.schema';

@Injectable()
export class TimekeepingService {
  constructor(
    @InjectModel(Timekeeping.name) private timekeepingModel: Model<Timekeeping>,
  ) {}

  async getTimekeepingByEmployee(user_id: number): Promise<any> {
    try {
      // const startOfMonth = dayjs().startOf('month').toDate();
      // const endOfMonth = dayjs().endOf('month').toDate();
      const timekeepingRecords = await this.timekeepingModel
        .find({
          user_id,
          // date: { $gte: startOfMonth, $lte: endOfMonth },
        })
        .select('date status late_minutes');

      console.log('timekeepingRecords', timekeepingRecords);

      const formattedData = timekeepingRecords.map((record) => ({
        date: dayjs(record.date).format('YYYY-MM-DD'),
        status: record.status,
        late_minutes: record.late_minutes,
      }));

      console.log('formattedData', formattedData);

      return {
        data: formattedData,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }

  // Check-in
  async checkIn(user_id: number): Promise<Timekeeping> {
    try {
      const today = dayjs().startOf('day').utc();
      const tomorrow = dayjs().endOf('day').utc();

      // Kiểm tra nếu hôm nay là thứ 7 hoặc Chủ Nhật
      const dayOfWeek = today.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        throw new HttpException(
          'Không check-in vào cuối tuần (Thứ 7, Chủ Nhật)',
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingRecord = await this.timekeepingModel.findOne({
        user_id,
        date: { $gte: today.toDate(), $lte: tomorrow.toDate() },
      });

      if (existingRecord) {
        throw new HttpException(
          'Bạn đã checked-in hôm nay',
          HttpStatus.BAD_REQUEST,
        );
      }

      const checkInTime = dayjs(); // Thời gian check-in hiện tại
      const workStartTime = dayjs().hour(9).minute(0); // Giờ bắt đầu làm việc

      // Kiểm tra xem check-in có trễ không
      const lateMinutes = checkInTime.isAfter(workStartTime)
        ? checkInTime.diff(workStartTime, 'minute')
        : 0;

      console.log('lateMinutes', lateMinutes);

      const newCheckIn = new this.timekeepingModel({
        user_id,
        date: today.toDate(),
        time_check_in: checkInTime.toDate(),
        status: lateMinutes > 0 ? 'late' : 'working', // Nếu trễ thì đánh dấu là 'late'
        late_minutes: lateMinutes, // Lưu số phút trễ
      });

      return newCheckIn.save();
    } catch (error) {
      console.error('Error in checkIn API:', error.message);

      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }

  // Check-out
  async checkOut(user_id: number): Promise<Timekeeping> {
    try {
      const today = dayjs().startOf('day').utc();
      const tomorrow = dayjs().endOf('day').utc();

      // Kiểm tra nếu hôm nay là thứ 7 hoặc Chủ Nhật
      const dayOfWeek = today.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        throw new HttpException(
          'Không check-out vào cuối tuần (Thứ 7, Chủ Nhật)',
          HttpStatus.BAD_REQUEST,
        );
      }

      const record = await this.timekeepingModel.findOne({
        user_id,
        date: { $gte: today.toDate(), $lte: tomorrow.toDate() },
      });

      if (!record) {
        throw new HttpException(
          'Bạn cần check-in trước',
          HttpStatus.BAD_REQUEST,
        );
      }

      const checkOutTime = dayjs().utc(); // Thời gian check-out hiện tại
      const workEndTime = dayjs().utc().hour(18).minute(0); // Giờ kết thúc làm việc
      // const lunchBreakEnd = dayjs().hour(12).minute(0); // Giờ kết thúc nghỉ trưa
      const totalWorkTime = checkOutTime.diff(record.time_check_in, 'minute'); // Tính tổng thời gian làm việc

      // Kiểm tra xem check-out có đủ 8 tiếng không
      const requiredWorkTime = 8 * 60; // 8 tiếng làm việc = 480 phút
      const workStatus =
        totalWorkTime < requiredWorkTime ? 'incomplete' : 'complete'; // Nếu thiếu thời gian làm việc, đánh dấu là 'incomplete'

      // Kiểm tra xem có check-out trước 18h không
      const earlyCheckOut = checkOutTime.isBefore(workEndTime);

      record.time_check_out = checkOutTime.toDate();
      record.status = earlyCheckOut ? 'early' : workStatus; // Nếu check-out trước 18h thì đánh dấu là 'early'
      record.late_minutes = earlyCheckOut
        ? workEndTime.diff(checkOutTime, 'minute')
        : 0; // Tính số phút thiếu nếu check-out trước 18h

      return record.save();
    } catch (error) {
      console.log('Error in checkOut API:', error.message);
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
