import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll() {
    return this.userService.getAllUsers();
  }

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Get('by-id/:id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth()
  async updateProfile(
    @CurrentUser('id') currentUserId: number,
    @Param('id') updateUserId: string,
    @Body() userDto: UserDto,
  ) {
    return this.userService.updateProfile(
      currentUserId,
      +updateUserId,
      userDto,
    );
  }

  @Patch('subscribe/:channelId')
  @HttpCode(200)
  @Auth()
  async subscribe(
    @CurrentUser('id') id: number,
    @Param('channelId') channelId: string,
  ) {
    return this.userService.subscribe(id, +channelId);
  }

  @Get('old-user/:email')
  async getOldUser(@Param('email') email: string) {
    return this.userService.getOldUser(email);
  }

  @Post('verify')
  async confirm(@Body() dto: ConfirmEmailDto) {
    const email = await this.userService.decodeConfirmationToken(dto.token);
    await this.userService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @Auth()
  async resendConfirmationLink(@CurrentUser('id') id: number) {
    await this.userService.resendConfirmationLink(id);
  }
}
