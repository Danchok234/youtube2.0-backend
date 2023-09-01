import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  createComment(
    @CurrentUser('id') authorId: number,
    @Param('id') videoId: string,
    @Body() dto: CommentDto,
  ) {
    return this.commentService.create(authorId, +videoId, dto);
  }
}
