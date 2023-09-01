import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import getVideoDurationInSeconds from 'get-video-duration'
import { VideoEntity } from 'src/video/entities/video.entity'
import { Repository } from 'typeorm'
import { IMediaResponse } from './media.interface'

@Injectable()
export class MediaService {
  async saveMedia(
    file: Express.Multer.File,
    folder = 'default',
  ): Promise<IMediaResponse> {

    const uploadFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadFolder);

    await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);

    try{

      const duration = await getVideoDurationInSeconds(`${uploadFolder}/${file.originalname}`)

      return {
        url: `/uploads/${folder}/${file.originalname}`,
        name: file.originalname,
        duration
      }

    }catch(e){

      return {
        url: `/uploads/${folder}/${file.originalname}`,
        name: file.originalname,
      }

    }
}}
