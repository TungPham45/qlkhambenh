import { Inject, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { JwtPayload, MSG, REDIS_SERVICES } from '@app/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(REDIS_SERVICES.AUTH_SERVICE) private readonly authClient: ClientProxy) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'clinic_jwt_super_secret_key_change_in_prod',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.username || typeof payload.sub !== 'string'
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.sub)) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    try {
      // Resolve current role, status and profile IDs so old tokens cannot retain revoked access.
      return await firstValueFrom(this.authClient.send(MSG.AUTH_ME, { accountId: payload.sub }).pipe(timeout(10000)));
    } catch (error) {
      if (Number(error?.statusCode || error?.error?.statusCode) === 401) {
        throw new UnauthorizedException(error?.message || 'Tài khoản không còn hoạt động');
      }
      throw new ServiceUnavailableException('Không thể kiểm tra tài khoản. Vui lòng thử lại');
    }
  }
}
