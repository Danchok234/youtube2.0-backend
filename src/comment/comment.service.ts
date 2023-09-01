import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CommentDto } from './dto/comment.dto'
import { CommentEntity } from './entities/comment.entity'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly CommentRepository: Repository<CommentEntity>,
  ) {}
  async create(authorId: number, videoId: number, dto: CommentDto) {
    const newComment = this.CommentRepository.create({
      commentText: dto.commentText,
      video: { id: videoId },
      author: { id: authorId },
    });
    return this.CommentRepository.save(newComment);
  }
}
