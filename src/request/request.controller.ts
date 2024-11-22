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
import {
  ApproveRequestDto,
  CreateRequestDto,
  PaginationDto,
} from './request.dto';
import { Roles } from 'src/shared/common';
import { RequestGuard } from './request.guard';
import { UserRequestInfo, UserRoleInfo } from 'src/users/users.decorator';
import { RolesGuard } from 'src/auth/role.guard';

@UseGuards(AuthGuard, RolesGuard, RequestGuard)
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('create-request')
  // @Roles('employee') // Chỉ employee được phép tạo request
  createRequest(
    @UserRequestInfo() user: any,
    @Body() createRequestDto: CreateRequestDto,
  ): Promise<any> {
    return this.requestService.createRequest({
      ...createRequestDto,
      id_employee: user.id,
    });
  }

  @Get('all-request')
  @Roles('manager', 'HR') // Chỉ manager hoặc HR được phép xem danh sách request
  getRequests(@Query('status') status: string): Promise<any> {
    return this.requestService.getRequests(status);
  }

  @Patch(':id/approve')
  @Roles('manager') // Chỉ manager được phép duyệt request
  approveRequest(
    @Param('id') id: number,
    @Body() approveRequestDto: ApproveRequestDto,
  ): Promise<any> {
    return this.requestService.approveRequest(id, approveRequestDto);
  }

  @Patch(':id/reject')
  @Roles('manager') // Chỉ manager được phép từ chối request
  rejectRequest(@Param('id') id: number): Promise<any> {
    return this.requestService.rejectRequest(id);
  }

  @UseGuards(RequestGuard)
  @Get('employee')
  async getRequestsByEmployee(
    @UserRoleInfo('id') user_id: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<any> {
    return this.requestService.getRequestsByEmployee(user_id, paginationDto);
  }
}
