import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';
import {
  MSG,
  LoginDto,
  RegisterDto,
  CreateAccountDto,
  UpdateAccountDto,
  UpdateProfileDto,
} from '@app/common';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}

  @MessagePattern(MSG.AUTH_LOGIN)
  async login(@Payload() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @MessagePattern(MSG.AUTH_REGISTER)
  async register(@Payload() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @MessagePattern(MSG.AUTH_UPDATE_PROFILE)
  async updateProfile(@Payload() data: { user: any; dto: UpdateProfileDto }) {
    return await this.authService.updateProfile(data.user, data.dto);
  }

  @MessagePattern(MSG.AUTH_GET_ACCOUNTS)
  async getAccounts(@Payload() query: any) {
    return await this.authService.getAccounts(query);
  }

  @MessagePattern(MSG.AUTH_GET_ACCOUNT_BY_USER)
  async getAccountByUsername(@Payload() data: { username: string }) {
    return await this.authService.getAccountByUsername(data.username);
  }

  @MessagePattern(MSG.AUTH_CREATE_ACCOUNT)
  async createAccount(@Payload() dto: CreateAccountDto) {
    return await this.authService.createAccount(dto);
  }

  @MessagePattern(MSG.AUTH_UPDATE_ACCOUNT)
  async updateAccount(@Payload() data: { username: string; dto: UpdateAccountDto }) {
    return await this.authService.updateAccount(data.username, data.dto);
  }

  @MessagePattern(MSG.AUTH_DELETE_ACCOUNT)
  async deleteAccount(@Payload() data: { username: string }) {
    return await this.authService.deleteAccount(data.username);
  }
}
