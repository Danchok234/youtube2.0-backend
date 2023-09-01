import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { SubscriptionEntity } from './entities/subscription.entity';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: JwtConfig,
    }),
    TypeOrmModule.forFeature([UserEntity, SubscriptionEntity]),
    EmailModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, EmailService],
  exports: [UserService],
})
export class UserModule {}
