import { Controller, Post, Get, Put, Delete, Body, Param, Query, Inject, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { REDIS_SERVICES, MSG, Public, Roles, CurrentUser, UserRole, LoginDto, RegisterDto, CreateAccountDto, UpdateAccountDto } from '@app/common';
import { RolesGuard } from '../guards/roles.guard';
import { ProfileDto } from './profile.dto';

@ApiTags('Authentication & Accounts')
@Controller('api')
export class AuthController {
  constructor(@Inject(REDIS_SERVICES.AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Public()
  @Post('auth/login')
  @ApiOperation({ summary: 'Đăng nhập người dùng' })
  login(@Body() dto: LoginDto) { return this.request(MSG.AUTH_LOGIN, dto); }

  @Public()
  @Post('auth/register')
  @ApiOperation({ summary: 'Đăng ký tài khoản người dùng / bệnh nhân mới' })
  register(@Body() dto: RegisterDto) { return this.request(MSG.AUTH_REGISTER, dto); }

  @ApiBearerAuth()
  @Get('auth/me')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại từ cơ sở dữ liệu' })
  me(@CurrentUser() user: any) { return { user }; }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.NGUOI_DUNG)
  @Get('auth/profile')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân của bệnh nhân đang đăng nhập' })
  getProfile(@CurrentUser() user: any) {
    return this.request('auth.get_profile', { accountId: user.id });
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.NGUOI_DUNG)
  @Post('auth/profile')
  @ApiOperation({ summary: 'Thêm thông tin cá nhân khi bệnh nhân chưa có hồ sơ' })
  createProfile(@CurrentUser() user: any, @Body() dto: ProfileDto) {
    return this.request('auth.create_profile', { accountId: user.id, dto });
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.NGUOI_DUNG, UserRole.BAC_SI)
  @Put('auth/profile')
  @ApiOperation({ summary: 'Cập nhật hồ sơ người dùng hiện tại' })
  updateProfile(@CurrentUser() user: any, @Body() dto: ProfileDto) {
    return this.request(MSG.AUTH_UPDATE_PROFILE, { accountId: user.id, dto });
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.NGUOI_DUNG)
  @Delete('auth/profile')
  @ApiOperation({ summary: 'Xóa thông tin cá nhân chưa có dữ liệu khám bệnh liên quan' })
  deleteProfile(@CurrentUser() user: any) {
    return this.request('auth.delete_profile', { accountId: user.id });
  }

  @Public()
  @Post('auth/refresh')
  @ApiOperation({ summary: 'Làm mới token' })
  refresh() { return { message: 'Token is valid' }; }

  @Public()
  @Post('auth/logout')
  @ApiOperation({ summary: 'Đăng xuất' })
  logout() { return { success: true, message: 'Đã đăng xuất' }; }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('accounts')
  @ApiOperation({ summary: 'Tìm kiếm tất cả tài khoản (Admin)' })
  getAccounts(@Query() query: any) { return this.request(MSG.AUTH_GET_ACCOUNTS, query); }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('accounts/:username')
  @ApiOperation({ summary: 'Lấy chi tiết tài khoản theo username (Admin)' })
  getAccount(@Param('username') username: string) {
    return this.request(MSG.AUTH_GET_ACCOUNT_BY_USER, { username });
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('accounts')
  @ApiOperation({ summary: 'Tạo tài khoản mới (Admin)' })
  createAccount(@Body() dto: CreateAccountDto) { return this.request(MSG.AUTH_CREATE_ACCOUNT, dto); }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('accounts/:username')
  @ApiOperation({ summary: 'Cập nhật tài khoản (Admin)' })
  updateAccount(@Param('username') username: string, @Body() dto: UpdateAccountDto, @CurrentUser() user: any) {
    return this.request(MSG.AUTH_UPDATE_ACCOUNT, { username, dto, actorId: user.id });
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('accounts/:username')
  @ApiOperation({ summary: 'Xóa tài khoản (Admin)' })
  deleteAccount(@Param('username') username: string, @CurrentUser() user: any) {
    return this.request(MSG.AUTH_DELETE_ACCOUNT, { username, actorId: user.id });
  }

  private async request(pattern: string | { cmd: string }, payload: any) {
    try { return await firstValueFrom(this.authClient.send(pattern, payload).pipe(timeout(10000))); }
    catch (error) {
      const candidateStatus = Number(error?.statusCode || error?.status || error?.error?.statusCode);
      const status = Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus <= 599
        ? candidateStatus : HttpStatus.SERVICE_UNAVAILABLE;
      const message = error?.message || error?.error?.message || 'Dịch vụ tài khoản tạm thời không khả dụng';
      throw new HttpException(message, status);
    }
  }
}
