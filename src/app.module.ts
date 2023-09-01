import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CommentModule } from './comment/comment.module'
import { getTypeOrmConfig } from './config/typeorm.config'
import { MediaModule } from './media/media.module'
import { UserModule } from './user/user.module'
import { VideoModule } from './video/video.module'
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    UserModule,
    VideoModule,
    AuthModule,
    CommentModule,
    MediaModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
