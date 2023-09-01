import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfig } from 'src/config/jwt.config';
import { EmailService } from 'src/email/email.service';
import { SubscriptionEntity } from 'src/user/entities/subscription.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { EmailConfirmationService } from '../user/email-confirmation/emailConfirmation.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from 'src/email/email.module'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: JwtConfig,
    }),
    TypeOrmModule.forFeature([UserEntity, SubscriptionEntity]),
    UserModule,EmailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, EmailService],
})
export class AuthModule {}
