import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';
import { MSG, LoginDto, RegisterDto, CreateAccountDto, UpdateAccountDto, UpdateProfileDto } from '@app/common';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}

  @MessagePattern(MSG.AUTH_LOGIN)
  login(@Payload() dto: LoginDto) { return this.execute(() => this.authService.login(dto)); }

  @MessagePattern(MSG.AUTH_REGISTER)
  register(@Payload() dto: RegisterDto) { return this.execute(() => this.authService.register(dto)); }

  @MessagePattern(MSG.AUTH_ME)
  currentUser(@Payload() data: { accountId: string }) {
    return this.execute(() => this.authService.getCurrentUser(data.accountId));
  }

  @MessagePattern('auth.get_profile')
  getProfile(@Payload() data: { accountId: string }) {
    return this.execute(() => this.authService.getProfile(data.accountId));
  }

  @MessagePattern('auth.create_profile')
  createProfile(@Payload() data: { accountId: string; dto: UpdateProfileDto }) {
    return this.execute(() => this.authService.createProfile(data.accountId, data.dto));
  }

  @MessagePattern(MSG.AUTH_UPDATE_PROFILE)
  updateProfile(@Payload() data: { accountId: string; dto: UpdateProfileDto }) {
    return this.execute(() => this.authService.updateProfile(data.accountId, data.dto));
  }

  @MessagePattern('auth.delete_profile')
  deleteProfile(@Payload() data: { accountId: string }) {
    return this.execute(() => this.authService.deleteProfile(data.accountId));
  }

  @MessagePattern(MSG.AUTH_GET_ACCOUNTS)
  getAccounts(@Payload() query: any) { return this.execute(() => this.authService.getAccounts(query)); }

  @MessagePattern(MSG.AUTH_GET_ACCOUNT_BY_USER)
  getAccountByUsername(@Payload() data: { username: string }) {
    return this.execute(() => this.authService.getAccountByUsername(data.username));
  }

  @MessagePattern(MSG.AUTH_CREATE_ACCOUNT)
  createAccount(@Payload() dto: CreateAccountDto) { return this.execute(() => this.authService.createAccount(dto)); }

  @MessagePattern(MSG.AUTH_UPDATE_ACCOUNT)
  updateAccount(@Payload() data: { username: string; dto: UpdateAccountDto; actorId: string }) {
    return this.execute(() => this.authService.updateAccount(data.username, data.dto, data.actorId));
  }

  @MessagePattern(MSG.AUTH_DELETE_ACCOUNT)
  deleteAccount(@Payload() data: { username: string; actorId: string }) {
    return this.execute(() => this.authService.deleteAccount(data.username, data.actorId));
  }

  private async execute(action: () => Promise<any>) {
    try { return await action(); }
    catch (error) {
      const statusCode = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
      const response = error instanceof HttpException ? error.getResponse() : null;
      const message = typeof response === 'object' && response !== null
        ? (response as any).message || error.message
        : statusCode === HttpStatus.INTERNAL_SERVER_ERROR ? 'Không thể thực hiện thao tác tài khoản. Vui lòng thử lại' : error.message;
      throw new RpcException({ statusCode, message });
    }
  }
}
