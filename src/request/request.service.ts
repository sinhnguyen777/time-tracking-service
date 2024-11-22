import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ApproveRequestDto,
  CreateRequestDto,
  PaginationDto,
} from './request.dto';
import { Request } from 'src/shared/schema/request.schema';
import * as dayjs from 'dayjs';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<Request>,
  ) {}

  async createRequest(createRequestDto: CreateRequestDto) {
    try {
      const { time_start, time_end, id_employee } = createRequestDto;

      // Kiểm tra ngày bắt đầu phải trước ngày kết thúc
      if (dayjs(time_start).isAfter(dayjs(time_end))) {
        throw new BadRequestException('Ngày bắt đầu phải trước ngày kết thúc.');
      }

      // Kiểm tra nhân viên đã có request trong khoảng thời gian này chưa
      const existingRequest = await this.requestModel.findOne({
        id_employee,
        time_start: { $lte: time_end },
        time_end: { $gte: time_start },
        status: { $ne: 'rejected' },
      });
      if (existingRequest) {
        throw new BadRequestException(
          'Bạn đã có request trong khoảng thời gian này.',
        );
      }

      const newRequest = new this.requestModel({
        ...createRequestDto,
        code_request: `REQ-${Date.now()}`,
        status: 'pending',
      });

      return newRequest.save();
    } catch (error) {
      console.log('error', error.message);
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }

  // Lấy danh sách request theo trạng thái
  async getRequests(status: string, page?: number, limit?: number) {
    try {
      const filter = status ? { status } : {};
      const requests = await this.requestModel
        .find(filter)
        .populate('id_employee', 'full_name email')
        .populate('id_manager', 'full_name email')
        .populate('id_request_type', 'name')
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.requestModel.countDocuments(filter);

      return { requests, total };
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }

  async getRequestsByEmployee(user_id: number, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, status } = paginationDto;

    const filter: any = { user_id }; // Lọc theo id_employee

    if (status) {
      filter.status = status; // Nếu có trạng thái, thêm vào điều kiện lọc
    }

    // Truy vấn các request của nhân viên
    const requests = await this.requestModel
      .find(filter)
      .skip((page - 1) * limit) // Phân trang
      .limit(limit) // Số lượng request trả về
      .populate('id_manager', 'full_name position')
      .populate('id_request_type', 'name')
      .exec();

    // Đếm tổng số request để tính toán phân trang
    const total = await this.requestModel.countDocuments(filter);

    return {
      requests,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Duyệt request
  async approveRequest(id: number, approveRequestDto: ApproveRequestDto) {
    try {
      const request = await this.requestModel.findById(id);
      if (!request) throw new NotFoundException('Request không tồn tại.');
      if (request.status !== 'pending') {
        throw new BadRequestException('Request này đã được xử lý.');
      }

      request.status = 'approved';
      request.note = approveRequestDto.note;
      request.updated_at = new Date();
      return request.save();
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }

  // Từ chối request
  async rejectRequest(id: number) {
    try {
      const request = await this.requestModel.findById(id);
      if (!request) throw new NotFoundException('Request không tồn tại.');
      if (request.status !== 'pending') {
        throw new BadRequestException('Request này đã được xử lý.');
      }

      request.status = 'rejected';
      request.updated_at = new Date();
      return request.save();
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }
}
