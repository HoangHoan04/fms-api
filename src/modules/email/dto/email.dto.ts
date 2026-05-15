import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SendVerifyEmailDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mã OTP xác thực' })
  @IsString()
  @IsNotEmpty()
  otpCode: string;
}

export class SendForgotPasswordEmailDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mã OTP khôi phục mật khẩu' })
  @IsString()
  @IsNotEmpty()
  otpCode: string;
}

export class SendWelcomeEmailDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tên thành viên' })
  @IsString()
  @IsNotEmpty()
  memberName: string;

  @ApiPropertyOptional({ description: 'Link đăng nhập' })
  @IsString()
  @IsOptional()
  loginUrl?: string;
}

export class SendReminderEmailDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tên thành viên' })
  @IsString()
  @IsNotEmpty()
  memberName: string;

  @ApiProperty({ description: 'Tên quỹ' })
  @IsString()
  @IsNotEmpty()
  fundName: string;

  @ApiProperty({ description: 'Tên chu kỳ (VD: Kỳ tháng 5/2026)' })
  @IsString()
  @IsNotEmpty()
  cycleName: string;

  @ApiProperty({ description: 'Số tiền cần đóng' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Hạn chót đóng (VD: 31/05/2026)' })
  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @ApiPropertyOptional({ description: 'Số ngày còn lại đến hạn' })
  @IsNumber()
  @IsOptional()
  daysRemaining?: number;
}

export class SendLatePaymentDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tên thành viên' })
  @IsString()
  @IsNotEmpty()
  memberName: string;

  @ApiProperty({ description: 'Tên quỹ' })
  @IsString()
  @IsNotEmpty()
  fundName: string;

  @ApiProperty({ description: 'Tên chu kỳ' })
  @IsString()
  @IsNotEmpty()
  cycleName: string;

  @ApiProperty({ description: 'Số tiền cần đóng' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Số ngày trễ' })
  @IsNumber()
  @Min(1)
  lateDays: number;

  @ApiPropertyOptional({ description: 'Tiền phạt trễ hạn' })
  @IsNumber()
  @IsOptional()
  lateFee?: number;

  @ApiProperty({ description: 'Hạn chót gốc' })
  @IsString()
  @IsNotEmpty()
  originalDueDate: string;
}

export class SendPaymentConfirmationDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tên thành viên' })
  @IsString()
  @IsNotEmpty()
  memberName: string;

  @ApiProperty({ description: 'Tên quỹ' })
  @IsString()
  @IsNotEmpty()
  fundName: string;

  @ApiProperty({ description: 'Tên chu kỳ' })
  @IsString()
  @IsNotEmpty()
  cycleName: string;

  @ApiProperty({ description: 'Số tiền đã đóng' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Thời điểm đóng (VD: 15/05/2026 14:30)' })
  @IsString()
  @IsNotEmpty()
  paidAt: string;

  @ApiPropertyOptional({ description: 'Mã giao dịch tham chiếu' })
  @IsString()
  @IsOptional()
  transactionRef?: string;
}

export class SendAcceptEmailDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tên thành viên' })
  @IsString()
  @IsNotEmpty()
  memberName: string;

  @ApiProperty({ description: 'Tên quỹ' })
  @IsString()
  @IsNotEmpty()
  fundName: string;

  @ApiProperty({ description: 'Mã đơn đăng ký' })
  @IsString()
  @IsNotEmpty()
  receiptCode: string;

  @ApiProperty({ description: 'Số tiền được duyệt' })
  @IsNumber()
  @Min(0)
  approvedAmount: number;

  @ApiPropertyOptional({ description: 'Ghi chú của người duyệt' })
  @IsString()
  @IsOptional()
  reviewNote?: string;
}

export class SendRejectEmailDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tên thành viên' })
  @IsString()
  @IsNotEmpty()
  memberName: string;

  @ApiProperty({ description: 'Tên quỹ' })
  @IsString()
  @IsNotEmpty()
  fundName: string;

  @ApiProperty({ description: 'Mã đơn đăng ký' })
  @IsString()
  @IsNotEmpty()
  receiptCode: string;

  @ApiProperty({ description: 'Lý do từ chối' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class SendDisbursementNotificationDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tên thành viên' })
  @IsString()
  @IsNotEmpty()
  memberName: string;

  @ApiProperty({ description: 'Tên quỹ' })
  @IsString()
  @IsNotEmpty()
  fundName: string;

  @ApiProperty({ description: 'Số tiền đã giải ngân' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Phương thức thanh toán' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ description: 'Mã giao dịch' })
  @IsString()
  @IsNotEmpty()
  transactionRef: string;

  @ApiProperty({ description: 'Thời điểm giải ngân' })
  @IsString()
  @IsNotEmpty()
  disbursedAt: string;
}

export class SendDisbursementConfirmationDto {
  @ApiProperty({ description: 'Email người nhận (admin/manager)' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tên người quản lý' })
  @IsString()
  @IsNotEmpty()
  managerName: string;

  @ApiProperty({ description: 'Tên thành viên đã xác nhận' })
  @IsString()
  @IsNotEmpty()
  memberName: string;

  @ApiProperty({ description: 'Tên quỹ' })
  @IsString()
  @IsNotEmpty()
  fundName: string;

  @ApiProperty({ description: 'Số tiền đã xác nhận' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Thời điểm xác nhận' })
  @IsString()
  @IsNotEmpty()
  confirmedAt: string;
}

export class SendCycleOpeningDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tên thành viên' })
  @IsString()
  @IsNotEmpty()
  memberName: string;

  @ApiProperty({ description: 'Tên quỹ' })
  @IsString()
  @IsNotEmpty()
  fundName: string;

  @ApiProperty({ description: 'Tên chu kỳ mới' })
  @IsString()
  @IsNotEmpty()
  cycleName: string;

  @ApiProperty({ description: 'Số tiền cần đóng' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Ngày bắt đầu' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'Hạn chót đóng' })
  @IsString()
  @IsNotEmpty()
  dueDate: string;
}

export class RecipientDto {
  @ApiProperty({ description: 'Email người nhận' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Tên người nhận' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class SendBulkEmailDto {
  @ApiProperty({ description: 'Danh sách người nhận' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipientDto)
  recipients: RecipientDto[];

  @ApiProperty({ description: 'Chủ đề email' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Nội dung email (hỗ trợ HTML)' })
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class BulkSendResult {
  success: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}
