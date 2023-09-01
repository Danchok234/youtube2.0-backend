import { IsNumber, IsString } from 'class-validator';
import { VideoDto } from 'src/video/dto/video.dto';

export class CommentDto {
  @IsString()
  commentText: string;
}
