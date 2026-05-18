// import { coreHelper } from '@/helpers';
// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';
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
// } from './dto/index.dto';

// @Injectable()
// export class EmailService {
//   private transporter: nodemailer.Transporter;
//   private senderAddress: string;
//   private senderName: string;

//   constructor(private readonly configService: ConfigService) {
//     const emailAccount =
//       this.configService.get<string>('EMAIL_VALIDATE_ACCOUNT') || '';
//     const emailPassword =
//       this.configService.get<string>('EMAIL_VALIDATE_PASSWORD') || '';

//     if (!emailAccount || !emailPassword) {
//       throw new InternalServerErrorException(
//         'Thiếu cấu hình EMAIL_VALIDATE_ACCOUNT hoặc EMAIL_VALIDATE_PASSWORD',
//       );
//     }

//     this.senderAddress = emailAccount;
//     this.senderName =
//       this.configService.get<string>('EMAIL_SENDER_NAME') ||
//       'Hệ thống Quản lý Quỹ nhóm Gia Đình Trẻ A3';

//     this.transporter = nodemailer.createTransport({
//       host: this.configService.get<string>('EMAIL_HOST') || 'smtp.gmail.com',
//       port: this.configService.get<number>('EMAIL_PORT') || 587,
//       secure: this.configService.get<boolean>('EMAIL_SECURE') || false,
//       auth: {
//         user: emailAccount,
//         pass: emailPassword,
//       },
//     });
//   }

//   // ==================== PUBLIC METHODS ====================

//   async sendEmailVerify(dto: SendVerifyEmailDto) {}

//   async sendEmailForgotPassword(dto: SendForgotPasswordEmailDto) {}

//   async sendEmailWelcome(dto: SendWelcomeEmailDto) {}

//   async sendEmailReminder(dto: SendReminderEmailDto) {}

//   async sendEmailLatePayment(dto: SendLatePaymentDto) {}

//   async sendEmailPaymentConfirmation(dto: SendPaymentConfirmationDto) {}

//   async sendEmailAccept(dto: SendAcceptEmailDto) {}

//   async sendEmailReject(dto: SendRejectEmailDto) {}

//   async sendEmailDisbursement(dto: SendDisbursementNotificationDto) {}

//   async sendEmailDisbursementConfirmation(
//     dto: SendDisbursementConfirmationDto,
//   ) {}

//   async sendEmailCycleOpening(dto: SendCycleOpeningDto) {}

//   // ==================== TEMPLATE HELPERS ====================

//   private getBaseTemplate(
//     contentHtml: string,
//     bannerTitle: string,
//     bannerIcon: string = '📧',
//     gradientFrom: string = '#4f46e5',
//     gradientTo: string = '#7c3aed',
//   ): string {
//     const currentYear = new Date().getFullYear();
//     return `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>${bannerTitle}</title>
//         <style>
//           body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; }
//           table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
//           img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
//         </style>
//       </head>
//       <body style="background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0;">
//         <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
//           <div style="text-align: center; padding: 30px 0; background-color: #ffffff;">
//             <span style="font-size: 28px; font-weight: 800; color: #4f46e5;">Quản lý Quỹ</span>
//           </div>
//           <div style="background: linear-gradient(120deg, ${gradientFrom} 0%, ${gradientTo} 100%); padding: 40px 20px; text-align: center; border-radius: 20px 20px 0 0; margin: 0 20px;">
//             <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px auto; line-height: 60px;">
//               <span style="font-size: 30px;">${bannerIcon}</span>
//             </div>
//             <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">${bannerTitle}</h1>
//           </div>
//           <div style="padding: 40px 30px; margin: 0 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 20px 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
//             ${contentHtml}
//           </div>
//           <div style="padding: 30px 20px; text-align: center;">
//             <div style="margin: 20px 0; border-top: 1px solid #e5e7eb; width: 100%;"></div>
//             <p style="color: #6b7280; font-size: 12px; line-height: 1.6;">
//               <strong>Hệ thống Quản lý Quỹ</strong><br>
//               📧 Email: support@fundmanager.vn<br>
//               🌐 Website: <a href="https://fundmanager.vn" style="color: #4f46e5; text-decoration: none;">www.fundmanager.vn</a>
//             </p>
//             <p style="color: #d1d5db; font-size: 11px; margin-top: 20px;">
//               &copy; ${currentYear} Hệ thống Quản lý Quỹ. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `;
//   }

//   private getOtpEmailTemplate(otpCode: string): string {
//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
//         Xin chào,<br>Để hoàn tất quá trình đăng ký và bảo mật tài khoản, vui lòng nhập mã xác thực (OTP) dưới đây:
//       </p>
//       <div style="background-color: #f9fafb; border: 2px dashed #4f46e5; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
//         <span style="display: block; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Mã xác thực của bạn</span>
//         <div style="color: #4f46e5; font-size: 38px; font-weight: 800; letter-spacing: 12px; font-family: monospace;">${otpCode}</div>
//       </div>
//       <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; padding: 15px; margin-top: 25px;">
//         <tr>
//           <td width="30" valign="top" style="font-size: 20px; padding-right: 10px;">🛡️</td>
//           <td>
//             <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.5;">
//               <strong>Lưu ý bảo mật:</strong> Mã này sẽ hết hạn sau <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này với bất kỳ ai.
//             </p>
//           </td>
//         </tr>
//       </table>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Trân trọng,<br>
//         <strong style="color: #4b5563;">Đội ngũ Hệ thống Quản lý Quỹ</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(content, 'Xác thực tài khoản', '✨');
//   }

//   private getForgotPasswordTemplate(otpCode: string): string {
//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
//         Chúng tôi nhận được yêu cầu thay đổi mật khẩu cho tài khoản của bạn. <br>Đừng lo lắng, hãy sử dụng mã bên dưới để thiết lập mật khẩu mới.
//       </p>
//       <div style="background-color: #fff1f2; border: 2px solid #fecdd3; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
//         <span style="display: block; color: #9f1239; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Mã xác minh bảo mật</span>
//         <div style="color: #e11d48; font-size: 38px; font-weight: 800; letter-spacing: 12px; font-family: monospace;">${otpCode}</div>
//       </div>
//       <div style="text-align: center; margin-bottom: 25px;">
//         <p style="font-size: 13px; color: #6b7280; font-style: italic;">(Mã này có hiệu lực trong vòng 5 phút)</p>
//       </div>
//       <div style="border-left: 4px solid #f59e0b; background-color: #fffbeb; padding: 15px; border-radius: 4px;">
//         <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
//           <strong>⚠️ Bạn không yêu cầu điều này?</strong><br>
//           Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ ngay với bộ phận hỗ trợ để bảo vệ tài khoản.
//         </p>
//       </div>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Trân trọng,<br>
//         <strong style="color: #4b5563;">Đội ngũ bảo mật</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(
//       content,
//       'Yêu cầu đặt lại mật khẩu',
//       '🔒',
//       '#ef4444',
//       '#f43f5e',
//     );
//   }

//   private getWelcomeTemplate(dto: SendWelcomeEmailDto): string {
//     const loginLink = dto.loginUrl || '#';
//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
//         Xin chào <strong>${dto.memberName}</strong>,
//       </p>
//       <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">
//         Chúc mừng bạn đã trở thành thành viên của <strong>Hệ thống Quản lý Quỹ</strong>!<br>
//         Bây giờ bạn có thể tham gia các quỹ nhóm, đóng góp và nhận hỗ trợ tài chính từ cộng đồng.
//       </p>
//       <div style="text-align: center; margin: 30px 0;">
//         <a href="${loginLink}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
//           Đăng nhập ngay
//         </a>
//       </div>
//       <table width="100%" cellpadding="10" cellspacing="0">
//         <tr>
//           <td width="33%" style="text-align: center; background-color: #f9fafb; border-radius: 8px;">
//             <div style="font-size: 28px; margin-bottom: 5px;">📋</div>
//             <p style="margin: 0; color: #374151; font-size: 13px; font-weight: 600;">Tham gia quỹ</p>
//             <p style="margin: 0; color: #6b7280; font-size: 12px;">Đăng ký tham gia quỹ nhóm</p>
//           </td>
//           <td width="33%" style="text-align: center; background-color: #f9fafb; border-radius: 8px;">
//             <div style="font-size: 28px; margin-bottom: 5px;">💰</div>
//             <p style="margin: 0; color: #374151; font-size: 13px; font-weight: 600;">Đóng góp</p>
//             <p style="margin: 0; color: #6b7280; font-size: 12px;">Thực hiện đóng quỹ đúng hạn</p>
//           </td>
//           <td width="33%" style="text-align: center; background-color: #f9fafb; border-radius: 8px;">
//             <div style="font-size: 28px; margin-bottom: 5px;">🎯</div>
//             <p style="margin: 0; color: #374151; font-size: 13px; font-weight: 600;">Nhận hỗ trợ</p>
//             <p style="margin: 0; color: #6b7280; font-size: 12px;">Đăng ký nhận tiền quỹ</p>
//           </td>
//         </tr>
//       </table>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Trân trọng,<br>
//         <strong style="color: #4b5563;">Đội ngũ Hệ thống Quản lý Quỹ</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(content, 'Chào mừng bạn!', '🎉');
//   }

//   private getReminderTemplate(dto: SendReminderEmailDto): string {
//     const amountStr = coreHelper.formatCurrency(dto.amount);
//     const urgencyColor =
//       dto.daysRemaining !== undefined && dto.daysRemaining <= 3
//         ? '#ef4444'
//         : '#f59e0b';
//     const urgencyBg =
//       dto.daysRemaining !== undefined && dto.daysRemaining <= 3
//         ? '#fef2f2'
//         : '#fffbeb';
//     const urgencyText =
//       dto.daysRemaining !== undefined && dto.daysRemaining <= 3
//         ? '⚠️ Khẩn cấp: Chỉ còn ' + dto.daysRemaining + ' ngày!'
//         : `⏰ Còn ${dto.daysRemaining ?? 'một số'} ngày đến hạn`;

//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
//         Xin chào <strong>${dto.memberName}</strong>,
//       </p>
//       <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">
//         Đây là email nhắc nhở bạn về khoản đóng quỹ sắp đến hạn.
//       </p>
//       <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
//         <table width="100%" cellpadding="8">
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Quỹ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.fundName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Chu kỳ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.cycleName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Số tiền cần đóng</td>
//             <td style="color: #4f46e5; font-size: 18px; font-weight: 700; text-align: right;">${amountStr}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Hạn chót</td>
//             <td style="color: #dc2626; font-size: 14px; font-weight: 600; text-align: right;">${dto.dueDate}</td>
//           </tr>
//         </table>
//       </div>
//       <div style="background-color: ${urgencyBg}; border-left: 4px solid ${urgencyColor}; padding: 15px; border-radius: 4px; text-align: center;">
//         <p style="margin: 0; color: ${urgencyColor}; font-size: 14px; font-weight: 600;">
//           ${urgencyText}
//         </p>
//       </div>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Trân trọng,<br>
//         <strong style="color: #4b5563;">Đội ngũ Hệ thống Quản lý Quỹ</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(
//       content,
//       'Nhắc nhở đóng quỹ',
//       '⏰',
//       '#f59e0b',
//       '#eab308',
//     );
//   }

//   private getLatePaymentTemplate(dto: SendLatePaymentDto): string {
//     const amountStr = coreHelper.formatCurrency(dto.amount);
//     const lateFeeStr = dto.lateFee
//       ? coreHelper.formatCurrency(dto.lateFee)
//       : null;
//     const totalStr = dto.lateFee
//       ? coreHelper.formatCurrency(dto.amount + dto.lateFee)
//       : null;

//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
//         Xin chào <strong>${dto.memberName}</strong>,
//       </p>
//       <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">
//         Bạn đã <strong style="color: #dc2626;">trễ hạn</strong> đóng quỹ ${dto.lateDays} ngày. Vui lòng thanh toán ngay để tránh ảnh hưởng đến quyền lợi.
//       </p>
//       <div style="background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 20px; margin: 20px 0;">
//         <table width="100%" cellpadding="8">
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Quỹ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.fundName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Chu kỳ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.cycleName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Hạn chót gốc</td>
//             <td style="color: #6b7280; font-size: 14px; text-align: right;">${dto.originalDueDate}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Số ngày trễ</td>
//             <td style="color: #dc2626; font-size: 14px; font-weight: 600; text-align: right;">${dto.lateDays} ngày</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Số tiền gốc</td>
//             <td style="color: #1f2937; font-size: 14px; text-align: right;">${amountStr}</td>
//           </tr>
//           ${
//             lateFeeStr
//               ? `
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Phí phạt trễ hạn</td>
//             <td style="color: #dc2626; font-size: 14px; font-weight: 600; text-align: right;">${lateFeeStr}</td>
//           </tr>
//           <tr style="border-top: 2px solid #fecaca;">
//             <td style="color: #6b7280; font-size: 14px; font-weight: 700;">Tổng cộng</td>
//             <td style="color: #dc2626; font-size: 18px; font-weight: 800; text-align: right;">${totalStr}</td>
//           </tr>
//           `
//               : ''
//           }
//         </table>
//       </div>
//       <div style="text-align: center; margin: 25px 0;">
//         <p style="color: #374151; font-size: 14px;">
//           Vui lòng liên hệ quản lý quỹ để được hỗ trợ nếu bạn gặp khó khăn trong việc thanh toán.
//         </p>
//       </div>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Trân trọng,<br>
//         <strong style="color: #4b5563;">Đội ngũ Hệ thống Quản lý Quỹ</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(
//       content,
//       'Cảnh báo trễ hạn đóng quỹ',
//       '🚨',
//       '#dc2626',
//       '#ef4444',
//     );
//   }

//   private getPaymentConfirmationTemplate(
//     dto: SendPaymentConfirmationDto,
//   ): string {
//     const amountStr = coreHelper.formatCurrency(dto.amount);
//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
//         Xin chào <strong>${dto.memberName}</strong>,
//       </p>
//       <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">
//         Hệ thống xác nhận đã nhận được khoản đóng quỹ của bạn. Thông tin chi tiết như sau:
//       </p>
//       <div style="background-color: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
//         <table width="100%" cellpadding="8">
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Quỹ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.fundName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Chu kỳ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.cycleName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Số tiền đã nhận</td>
//             <td style="color: #16a34a; font-size: 20px; font-weight: 800; text-align: right;">${amountStr}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Thời điểm</td>
//             <td style="color: #1f2937; font-size: 14px; text-align: right;">${dto.paidAt}</td>
//           </tr>
//           ${
//             dto.transactionRef
//               ? `
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Mã giao dịch</td>
//             <td style="color: #6b7280; font-size: 13px; text-align: right; font-family: monospace;">${dto.transactionRef}</td>
//           </tr>
//           `
//               : ''
//           }
//         </table>
//       </div>
//       <div style="text-align: center; margin: 20px 0;">
//         <div style="font-size: 48px;">✅</div>
//         <p style="color: #16a34a; font-size: 15px; font-weight: 600;">Giao dịch thành công!</p>
//       </div>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Cảm ơn bạn đã đóng góp đúng hạn!<br>
//         <strong style="color: #4b5563;">Đội ngũ Hệ thống Quản lý Quỹ</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(
//       content,
//       'Xác nhận đã nhận tiền',
//       '✅',
//       '#16a34a',
//       '#22c55e',
//     );
//   }

//   private getAcceptTemplate(dto: SendAcceptEmailDto): string {
//     const amountStr = coreHelper.formatCurrency(dto.approvedAmount);
//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
//         Xin chào <strong>${dto.memberName}</strong>,
//       </p>
//       <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">
//         Đơn đăng ký nhận quỹ của bạn đã được <strong style="color: #16a34a;">phê duyệt</strong>! 🎉
//       </p>
//       <div style="background-color: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
//         <table width="100%" cellpadding="8">
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Mã đơn</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.receiptCode}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Quỹ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.fundName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Số tiền được duyệt</td>
//             <td style="color: #16a34a; font-size: 20px; font-weight: 800; text-align: right;">${amountStr}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Trạng thái</td>
//             <td style="color: #16a34a; font-size: 14px; font-weight: 600; text-align: right;">Đã duyệt ✅</td>
//           </tr>
//         </table>
//       </div>
//       ${
//         dto.reviewNote
//           ? `
//       <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin: 15px 0;">
//         <p style="margin: 0; color: #6b7280; font-size: 12px; font-weight: 600;">GHI CHÚ TỪ NGƯỜI DUYỆT</p>
//         <p style="margin: 5px 0 0; color: #374151; font-size: 14px;">${dto.reviewNote}</p>
//       </div>
//       `
//           : ''
//       }
//       <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
//         Tiền sẽ được chuyển đến tài khoản ngân hàng của bạn trong thời gian sớm nhất.
//       </p>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Trân trọng,<br>
//         <strong style="color: #4b5563;">Đội ngũ Hệ thống Quản lý Quỹ</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(
//       content,
//       'Đơn đã được duyệt',
//       '🎉',
//       '#16a34a',
//       '#22c55e',
//     );
//   }

//   private getRejectTemplate(dto: SendRejectEmailDto): string {
//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
//         Xin chào <strong>${dto.memberName}</strong>,
//       </p>
//       <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">
//         Rất tiếc, đơn đăng ký nhận quỹ của bạn đã bị <strong style="color: #dc2626;">từ chối</strong>.
//       </p>
//       <div style="background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 20px; margin: 20px 0;">
//         <table width="100%" cellpadding="8">
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Mã đơn</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.receiptCode}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Quỹ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.fundName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Trạng thái</td>
//             <td style="color: #dc2626; font-size: 14px; font-weight: 600; text-align: right;">Bị từ chối ❌</td>
//           </tr>
//         </table>
//       </div>
//       <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
//         <p style="margin: 0; color: #92400e; font-size: 13px;">
//           <strong>Lý do từ chối:</strong><br>
//           ${dto.reason}
//         </p>
//       </div>
//       <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
//         Bạn có thể liên hệ với quản lý quỹ để biết thêm chi tiết hoặc nộp đơn lại sau khi khắc phục.
//       </p>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Trân trọng,<br>
//         <strong style="color: #4b5563;">Đội ngũ Hệ thống Quản lý Quỹ</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(
//       content,
//       'Đơn đã bị từ chối',
//       '❌',
//       '#dc2626',
//       '#ef4444',
//     );
//   }

//   private getDisbursementTemplate(
//     dto: SendDisbursementNotificationDto,
//   ): string {
//     const amountStr = coreHelper.formatCurrency(dto.amount);
//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
//         Xin chào <strong>${dto.memberName}</strong>,
//       </p>
//       <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">
//         Tiền quỹ đã được giải ngân thành công! Vui lòng kiểm tra tài khoản ngân hàng của bạn.
//       </p>
//       <div style="background-color: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
//         <table width="100%" cellpadding="8">
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Quỹ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.fundName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Số tiền đã giải ngân</td>
//             <td style="color: #16a34a; font-size: 20px; font-weight: 800; text-align: right;">${amountStr}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Phương thức</td>
//             <td style="color: #1f2937; font-size: 14px; text-align: right;">${dto.paymentMethod}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Mã giao dịch</td>
//             <td style="color: #6b7280; font-size: 13px; text-align: right; font-family: monospace;">${dto.transactionRef}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Thời gian</td>
//             <td style="color: #1f2937; font-size: 14px; text-align: right;">${dto.disbursedAt}</td>
//           </tr>
//         </table>
//       </div>
//       <div style="background-color: #eff6ff; border-radius: 8px; padding: 15px; margin: 15px 0;">
//         <p style="margin: 0; color: #1e40af; font-size: 13px;">
//           <strong>📌 Lưu ý:</strong> Nếu bạn chưa nhận được tiền sau 24h, vui lòng liên hệ ngay với quản lý quỹ để được hỗ trợ.
//         </p>
//       </div>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Trân trọng,<br>
//         <strong style="color: #4b5563;">Đội ngũ Hệ thống Quản lý Quỹ</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(
//       content,
//       'Giải ngân thành công',
//       '💰',
//       '#16a34a',
//       '#22c55e',
//     );
//   }

//   private getDisbursementConfirmationTemplate(
//     dto: SendDisbursementConfirmationDto,
//   ): string {
//     const amountStr = coreHelper.formatCurrency(dto.amount);
//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
//         Xin chào <strong>${dto.managerName}</strong>,
//       </p>
//       <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">
//         Thành viên <strong>${dto.memberName}</strong> đã xác nhận đã nhận được tiền giải ngân từ quỹ.
//       </p>
//       <div style="background-color: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
//         <table width="100%" cellpadding="8">
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Quỹ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.fundName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Thành viên</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.memberName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Số tiền đã xác nhận</td>
//             <td style="color: #16a34a; font-size: 20px; font-weight: 800; text-align: right;">${amountStr}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Thời điểm xác nhận</td>
//             <td style="color: #1f2937; font-size: 14px; text-align: right;">${dto.confirmedAt}</td>
//           </tr>
//         </table>
//       </div>
//       <div style="text-align: center; margin: 20px 0;">
//         <div style="font-size: 48px;">✅</div>
//         <p style="color: #16a34a; font-size: 15px; font-weight: 600;">Hoàn tất giải ngân!</p>
//       </div>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Trân trọng,<br>
//         <strong style="color: #4b5563;">Đội ngũ Hệ thống Quản lý Quỹ</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(
//       content,
//       'Xác nhận đã nhận tiền',
//       '✅',
//       '#16a34a',
//       '#22c55e',
//     );
//   }

//   private getCycleOpeningTemplate(dto: SendCycleOpeningDto): string {
//     const amountStr = coreHelper.formatCurrency(dto.amount);
//     const content = `
//       <p style="color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
//         Xin chào <strong>${dto.memberName}</strong>,
//       </p>
//       <p style="color: #374151; font-size: 15px; line-height: 1.6; text-align: center;">
//         Chu kỳ đóng quỹ mới đã được mở! Hãy chuẩn bị đóng góp đúng hạn để duy trì quyền lợi của bạn.
//       </p>
//       <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
//         <table width="100%" cellpadding="8">
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Quỹ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.fundName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Chu kỳ</td>
//             <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right;">${dto.cycleName}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Số tiền cần đóng</td>
//             <td style="color: #4f46e5; font-size: 18px; font-weight: 700; text-align: right;">${amountStr}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Ngày bắt đầu</td>
//             <td style="color: #1f2937; font-size: 14px; text-align: right;">${dto.startDate}</td>
//           </tr>
//           <tr>
//             <td style="color: #6b7280; font-size: 13px;">Hạn chót</td>
//             <td style="color: #dc2626; font-size: 14px; font-weight: 600; text-align: right;">${dto.dueDate}</td>
//           </tr>
//         </table>
//       </div>
//       <div style="background-color: #eff6ff; border-radius: 8px; padding: 15px; margin: 15px 0;">
//         <p style="margin: 0; color: #1e40af; font-size: 13px;">
//           <strong>💡 Mẹo:</strong> Bạn có thể đóng quỹ qua chuyển khoản ngân hàng hoặc tiền mặt tại văn phòng quản lý quỹ.
//         </p>
//       </div>
//       <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
//         Trân trọng,<br>
//         <strong style="color: #4b5563;">Đội ngũ Hệ thống Quản lý Quỹ</strong>
//       </p>
//     `;
//     return this.getBaseTemplate(
//       content,
//       'Mở chu kỳ mới',
//       '📢',
//       '#4f46e5',
//       '#7c3aed',
//     );
//   }
// }
