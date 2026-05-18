import { CurrentUser } from '@/common/decorators';
import { JwtAuthGuard } from '@/common/guards';
import { UserDto } from '@/dto';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import {
  ChangePasswordDto,
  CheckPhoneAndEmailDto,
  ForgotPasswordMemberDto,
  RefreshTokenDto,
  UpdatePasswordDto,
  UserLoginDto,
} from '../dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  async login(@Body() data: UserLoginDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers?.['user-agent'];
    return await this.service.login();
  }

  @Post('check-phone-email')
  async checkPhoneAndEmail(@Body() data: CheckPhoneAndEmailDto) {
    return await this.service.checkPhoneAndEmail(data);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordMemberDto) {
    return await this.service.forgotPassword(data);
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
    return await this.service.updatePassword();
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() info: ChangePasswordDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.changePassword();
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
