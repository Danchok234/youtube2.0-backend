import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentService } from 'src/comment/comment.service'
import { VideoEntity } from './entities/video.entity'
import { VideoController } from './video.controller'
import { VideoService } from './video.service'
import { CommentEntity } from 'src/comment/entities/comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, CommentEntity])],
  controllers: [VideoController],
  providers: [VideoService, CommentService],
})
export class VideoModule {}
