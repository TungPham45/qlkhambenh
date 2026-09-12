import { UserRole } from '../constants';

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  patientId?: number;
  staffId?: number;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: UserRole;
  patientId?: number;
  staffId?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
