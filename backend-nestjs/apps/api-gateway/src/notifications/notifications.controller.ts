import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import {
  CurrentUser,
  CreateNotificationDto,
  MSG,
  NotificationQueryDto,
  REDIS_SERVICES,
  Roles,
  UpdateNotificationDto,
  UserRole,
} from '@app/common';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('api/notifications')
export class NotificationsController {
  constructor(
    @Inject(REDIS_SERVICES.AUTH_SERVICE)
    private readonly authClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy thông báo của tài khoản đang đăng nhập' })
  getAll(@Query() query: NotificationQueryDto, @CurrentUser() user: any) {
    return this.forward(MSG.NOTIFICATION_GET_ALL, { query, user });
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Đếm thông báo chưa đọc' })
  getUnreadCount(@CurrentUser() user: any) {
    return this.forward(MSG.NOTIFICATION_UNREAD_COUNT, { user });
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả thông báo là đã đọc' })
  markAllRead(@CurrentUser() user: any) {
    return this.forward(MSG.NOTIFICATION_MARK_ALL_READ, { user });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem một thông báo thuộc tài khoản hiện tại' })
  getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.forward(MSG.NOTIFICATION_GET_BY_ID, { id, user });
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Đánh dấu một thông báo là đã đọc' })
  markRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.forward(MSG.NOTIFICATION_MARK_READ, { id, user });
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo thông báo cho tài khoản (Admin)' })
  create(@Body() dto: CreateNotificationDto, @CurrentUser() user: any) {
    return this.forward(MSG.NOTIFICATION_CREATE, { dto, user });
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông báo (Admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNotificationDto,
    @CurrentUser() user: any,
  ) {
    return this.forward(MSG.NOTIFICATION_UPDATE, { id, dto, user });
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Xóa thông báo (Admin)' })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.forward(MSG.NOTIFICATION_DELETE, { id, user });
  }

  private async forward(pattern: object, payload: unknown) {
    try {
      return await firstValueFrom(this.authClient.send(pattern, payload));
    } catch (error) {
      const details =
        error?.message && typeof error.message === 'object'
          ? error.message
          : error?.error && typeof error.error === 'object'
            ? error.error
            : error;
      const candidateStatus = details?.statusCode ?? details?.status;
      const status =
        Number.isInteger(candidateStatus) &&
        candidateStatus >= 400 &&
        candidateStatus <= 599
          ? candidateStatus
          : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(
        details?.message || error?.message || 'Không thể xử lý thông báo',
        status,
      );
    }
  }
}
