import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto } from '@/dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import {
  ChangePasswordDto,
  CheckPhoneAndEmailDto,
  FacebookLoginDto,
  ForgotPasswordMemberDto,
  GoogleLoginDto,
  RefreshTokenDto,
  RegisterDto,
  SendOtpMemberDto,
  SendOtpVerifyDto,
  UpdatePasswordDto,
  UserLoginDto,
  VerifyLoginOtpDto,
} from '../dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthUserController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  async login(@Body() data: UserLoginDto) {
    return await this.service.login(data);
  }

  @Post('login/google')
  async loginWithGoogle(@Body() data: GoogleLoginDto) {
    return await this.service.loginWithGoogle(data);
  }

  @Post('login/facebook')
  async loginWithFacebook(@Body() data: FacebookLoginDto) {
    return await this.service.loginWithFacebook(data);
  }

  @Post('check-phone-email')
  async checkPhoneAndEmail(@Body() data: CheckPhoneAndEmailDto) {
    return await this.service.checkPhoneAndEmail(data);
  }

  @Post('send-otp')
  async sendOtpMember(@Body() data: SendOtpMemberDto) {
    return await this.service.sendOtpMember(data);
  }

  @Post('send-otp-verify')
  async sendOtpVerify(@Body() data: SendOtpVerifyDto) {
    return await this.service.sendOtpVerify(data);
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return await this.service.register(data);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordMemberDto) {
    return await this.service.forgotPassword(data);
  }

  @Post('verify-otp')
  async verifyLoginOtp(@Body() data: VerifyLoginOtpDto) {
    return await this.service.verifyLoginOtp(data);
  }

  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDto) {
    return await this.service.refreshToken(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-password')
  async updatePassword(
    @Body() info: UpdatePasswordDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.updatePassword(info, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() info: ChangePasswordDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.changePassword(info, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async getUserInfo(@CurrentUser() user: UserDto) {
    return await this.service.getUserInfo(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: UserDto) {
    return await this.service.logout(user);
  }
}
