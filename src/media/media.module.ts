import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { path } from 'app-root-path'
import { VideoEntity } from 'src/video/entities/video.entity'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot:'/uploads'
    })
  ],
  controllers: [MediaController],
  providers: [MediaService]
})
export class MediaModule {}
