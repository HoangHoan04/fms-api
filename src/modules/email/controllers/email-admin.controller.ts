// import { Body, Controller, Post } from '@nestjs/common';
// import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import {
//   SendAcceptEmailDto,
//   SendCycleOpeningDto,
//   SendDisbursementConfirmationDto,
//   SendDisbursementNotificationDto,
//   SendForgotPasswordEmailDto,
//   SendLatePaymentDto,
//   SendPaymentConfirmationDto,
//   SendRejectEmailDto,
//   SendReminderEmailDto,
//   SendVerifyEmailDto,
//   SendWelcomeEmailDto,
// } from '../dto/index.dto';
// // import { EmailService } from '../email.service';

// @ApiTags('Email')
// @Controller('email')
// export class EmailController {
//   constructor(private readonly service: EmailService) {}

//   @ApiOperation({ summary: 'Gửi email xác thực đăng ký tài khoản' })
//   @Post('send-verify-email')
//   public async sendVerify(@Body() data: SendVerifyEmailDto) {
//     return await this.service.sendEmailVerify(data);
//   }

//   @ApiOperation({ summary: 'Gửi email quên mật khẩu' })
//   @Post('send-forgot-password-email')
//   public async sendForgotPassword(@Body() data: SendForgotPasswordEmailDto) {
//     return await this.service.sendEmailForgotPassword(data);
//   }

//   @ApiOperation({ summary: 'Gửi email chào mừng thành viên mới' })
//   @Post('send-welcome-email')
//   public async sendWelcome(@Body() data: SendWelcomeEmailDto) {
//     return await this.service.sendEmailWelcome(data);
//   }

//   @ApiOperation({ summary: 'Gửi email nhắc đến hạn đóng tiền' })
//   @Post('send-reminder-email')
//   public async sendReminder(@Body() data: SendReminderEmailDto) {
//     return await this.service.sendEmailReminder(data);
//   }

//   @ApiOperation({ summary: 'Gửi email cảnh báo đóng tiền trễ hạn' })
//   @Post('send-late-payment-email')
//   public async sendLatePayment(@Body() data: SendLatePaymentDto) {
//     return await this.service.sendEmailLatePayment(data);
//   }

//   @ApiOperation({ summary: 'Gửi email xác nhận đã nhận tiền đóng quỹ' })
//   @Post('send-payment-confirmation-email')
//   public async sendPaymentConfirmation(
//     @Body() data: SendPaymentConfirmationDto,
//   ) {
//     return await this.service.sendEmailPaymentConfirmation(data);
//   }

//   @ApiOperation({
//     summary: 'Gửi email thông báo đơn đăng ký nhận quỹ đã được duyệt',
//   })
//   @Post('send-accept-email')
//   public async sendAccept(@Body() data: SendAcceptEmailDto) {
//     return await this.service.sendEmailAccept(data);
//   }

//   @ApiOperation({
//     summary: 'Gửi email thông báo đơn đăng ký nhận quỹ bị từ chối',
//   })
//   @Post('send-reject-email')
//   public async sendReject(@Body() data: SendRejectEmailDto) {
//     return await this.service.sendEmailReject(data);
//   }

//   @ApiOperation({
//     summary: 'Gửi email thông báo đã giải ngân tiền cho thành viên',
//   })
//   @Post('send-disbursement-notification')
//   public async sendDisbursement(@Body() data: SendDisbursementNotificationDto) {
//     return await this.service.sendEmailDisbursement(data);
//   }

//   @ApiOperation({
//     summary: 'Gửi email xác nhận thành viên đã nhận tiền giải ngân',
//   })
//   @Post('send-disbursement-confirmation')
//   public async sendDisbursementConfirmation(
//     @Body() data: SendDisbursementConfirmationDto,
//   ) {
//     return await this.service.sendEmailDisbursementConfirmation(data);
//   }

//   @ApiOperation({ summary: 'Gửi email thông báo mở chu kỳ đóng quỹ mới' })
//   @Post('send-cycle-opening-email')
//   public async sendCycleOpening(@Body() data: SendCycleOpeningDto) {
//     return await this.service.sendEmailCycleOpening(data);
//   }

//   @ApiOperation({ summary: 'Gửi email hàng loạt' })
//   @Post('send-bulk')
//   public async sendBulk(@Body() data: SendBulkEmailDto) {
//     return await this.service.sendBulkEmail(data);
//   }
// }
