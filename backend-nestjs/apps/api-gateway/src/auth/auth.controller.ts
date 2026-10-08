import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  REDIS_SERVICES,
  MSG,
  Public,
  Roles,
  CurrentUser,
  UserRole,
  LoginDto,
  RegisterDto,
  CreateAccountDto,
  UpdateAccountDto,
  UpdateProfileDto,
} from '@app/common';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Authentication & Accounts')
@Controller('api')
export class AuthController {
  constructor(
    @Inject(REDIS_SERVICES.AUTH_SERVICE)
    private readonly authClient: ClientProxy,
  ) {}

  @Public()
  @Post('auth/login')
  @ApiOperation({ summary: 'Đăng nhập người dùng' })
  async login(@Body() dto: LoginDto) {
    return await firstValueFrom(this.authClient.send(MSG.AUTH_LOGIN, dto));
  }

  @Public()
  @Post('auth/register')
  @ApiOperation({ summary: 'Đăng ký tài khoản người dùng / bệnh nhân mới' })
  async register(@Body() dto: RegisterDto) {
    return await firstValueFrom(this.authClient.send(MSG.AUTH_REGISTER, dto));
  }

  @ApiBearerAuth()
  @Get('auth/me')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản hiện tại' })
  async me(@CurrentUser() user: any) {
    return { user };
  }

  @ApiBearerAuth()
  @Put('auth/profile')
  @ApiOperation({ summary: 'Cập nhật hồ sơ người dùng hiện tại' })
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return await firstValueFrom(
      this.authClient.send(MSG.AUTH_UPDATE_PROFILE, { accountId: user.id, dto }),
    );
  }

  @Public()
  @Post('auth/refresh')
  @ApiOperation({ summary: 'Làm mới token' })
  async refresh() {
    return { message: 'Token is valid' };
  }

  @Public()
  @Post('auth/logout')
  @ApiOperation({ summary: 'Đăng xuất' })
  async logout() {
    return { success: true, message: 'Đã đăng xuất' };
  }

  // --- ACCOUNTS CRUD (Admin) ---
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('accounts')
  @ApiOperation({ summary: 'Lấy danh sách tất cả tài khoản (Admin)' })
  async getAccounts(@Query() query: any) {
    return await firstValueFrom(this.authClient.send(MSG.AUTH_GET_ACCOUNTS, query));
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('accounts/:username')
  @ApiOperation({ summary: 'Lấy chi tiết tài khoản theo username' })
  async getAccount(@Param('username') username: string) {
    return await firstValueFrom(
      this.authClient.send(MSG.AUTH_GET_ACCOUNT_BY_USER, { username }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('accounts')
  @ApiOperation({ summary: 'Tạo tài khoản mới (Admin)' })
  async createAccount(@Body() dto: CreateAccountDto) {
    return await firstValueFrom(this.authClient.send(MSG.AUTH_CREATE_ACCOUNT, dto));
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('accounts/:username')
  @ApiOperation({ summary: 'Cập nhật tài khoản (Admin)' })
  async updateAccount(
    @Param('username') username: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return await firstValueFrom(
      this.authClient.send(MSG.AUTH_UPDATE_ACCOUNT, { username, dto }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('accounts/:username')
  @ApiOperation({ summary: 'Xóa tài khoản (Admin)' })
  async deleteAccount(@Param('username') username: string) {
    return await firstValueFrom(
      this.authClient.send(MSG.AUTH_DELETE_ACCOUNT, { username }),
    );
  }
}
