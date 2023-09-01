import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmailConfirmationService } from 'src/user/email-confirmation/emailConfirmation.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService:UserService
  ) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const user = await this.authService.register(dto);
    await this.userService.sendVerificationLink(dto.email);
    return user;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
