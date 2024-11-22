import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import {
  ApproveRequestDto,
  CreateRequestDto,
  PaginationDto,
} from './request.dto';
import { Roles } from 'src/shared/common';

@Controller('requests')
@UseGuards(AuthGuard, RolesGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @Roles('employee') // Chỉ employee được phép tạo request
  createRequest(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.createRequest(createRequestDto);
  }

  @Get()
  @Roles('manager', 'HR') // Chỉ manager hoặc HR được phép xem danh sách request
  getRequests(@Query('status') status: string) {
    return this.requestService.getRequests(status);
  }

  @Patch(':id/approve')
  @Roles('manager') // Chỉ manager được phép duyệt request
  approveRequest(
    @Param('id') id: number,
    @Body() approveRequestDto: ApproveRequestDto,
  ) {
    return this.requestService.approveRequest(id, approveRequestDto);
  }

  @Patch(':id/reject')
  @Roles('manager') // Chỉ manager được phép từ chối request
  rejectRequest(@Param('id') id: number) {
    return this.requestService.rejectRequest(id);
  }

  @Get('employee')
  async getRequestsByEmployee(
    @Param('id_employee') id_employee: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.requestService.getRequestsByEmployee(
      id_employee,
      paginationDto,
    );
  }
}
