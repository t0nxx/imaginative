import { Post, Controller, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import LoginUserDto from './dto/LoginUser.dto';
import { RegisterUserDto } from './dto/RegisterUser.dto';
import RefreshTokenDto from './dto/RefreshToken.dto';
import ForgetPasswordDto from './dto/ForgetPassword.dto';
import ResetPasswordDto from './dto/ResetPassword.dto';
import { AccountTypeProviderEnum, SocialLoginDto } from './dto/SocialLogin.dto';
import VerifyEmailDto from './dto/verifyEmail.dto';

@ApiTags('Authentication')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() body: RegisterUserDto): Promise<any> {
    return this.userService.register(body);
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto): Promise<any> {
    return this.userService.localLogin(body);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<any> {
    return this.userService.refreshToken(body.refreshToken);
  }

  @Post('/verification-code')
  async sendVerificationEmail(@Body() body: ForgetPasswordDto): Promise<any> {
    return this.userService.sendVerificationEmail(body.email);
  }

  @Post('/verify-account')
  async verifyEmail(@Body() body: VerifyEmailDto): Promise<any> {
    return this.userService.verifyEmail(body.email, body.code, body.password);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgetPasswordDto): Promise<any> {
    return this.userService.forgotPassword(body.email);
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto): Promise<any> {
    return this.userService.resetPassword(body);
  }

  @Post('/facebook')
  async facebookLogin(@Body() body: SocialLoginDto): Promise<any> {
    return this.userService.socialLogin(
      body.token,
      AccountTypeProviderEnum.facebook,
    );
  }

  @Post('/google')
  async googleLogin(@Body() body: SocialLoginDto): Promise<any> {
    return this.userService.socialLogin(
      body.token,
      AccountTypeProviderEnum.google,
    );
  }

  @Post('/apple')
  async appleLogin(@Body() body: SocialLoginDto): Promise<any> {
    return this.userService.socialLogin(
      body.token,
      AccountTypeProviderEnum.apple,
    );
  }
}
