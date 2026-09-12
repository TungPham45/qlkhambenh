import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@app/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'clinic_jwt_super_secret_key_change_in_prod',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.username) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      patientId: payload.patientId,
      staffId: payload.staffId,
      MaBN: payload.patientId,
      MaNV: payload.staffId,
    };
  }
}
