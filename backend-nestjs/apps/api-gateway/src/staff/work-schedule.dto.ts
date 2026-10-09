import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class WorkScheduleDto {
  @Type(() => Number)
  @IsInt({ message: 'Mã bác sĩ phải là số nguyên' })
  @Min(1, { message: 'Vui lòng chọn bác sĩ' })
  doctorId: number;

  @IsDateString({ strict: true }, { message: 'Ngày làm việc không hợp lệ' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Ngày làm việc phải có định dạng YYYY-MM-DD' })
  workDate: string;

  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/, { message: 'Giờ bắt đầu không hợp lệ' })
  startTime: string;

  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/, { message: 'Giờ kết thúc không hợp lệ' })
  endTime: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Thời lượng mỗi ca phải là số phút nguyên' })
  @Min(1, { message: 'Thời lượng mỗi ca phải lớn hơn 0' })
  slotMinutes?: number;

  @IsOptional()
  @IsIn(['Active', 'Inactive'], { message: 'Trạng thái lịch làm việc không hợp lệ' })
  status?: string;

  @IsOptional()
  @IsString({ message: 'Ghi chú không hợp lệ' })
  notes?: string;
}
