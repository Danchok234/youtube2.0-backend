import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { MediaService } from './media.service'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('media'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.mediaService.saveMedia(file, folder);
  }
}
