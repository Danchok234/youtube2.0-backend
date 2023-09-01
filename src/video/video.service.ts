import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhereProperty, ILike, MoreThan, Repository } from 'typeorm'
import { VideoDto } from './dto/video.dto'
import { VideoEntity } from './entities/video.entity'
import { CommentService } from 'src/comment/comment.service'
import { CommentEntity } from 'src/comment/entities/comment.entity'

@Injectable()
export class VideoService{
	constructor(
		@InjectRepository(VideoEntity)
		private readonly VideoRepository:Repository<VideoEntity>,
		@InjectRepository(CommentEntity)
		private readonly CommentRepository:Repository<CommentEntity>
	){}

	async getAllVideos(searchTerm?:string){
		let options:FindOptionsWhereProperty<VideoEntity> = {}

		if(searchTerm) options = { name:ILike(`%${searchTerm}%`) }

		const videos = await this.VideoRepository.find({
			where:{
				...options,
				isPublic:true
			},
			order:{
				createdAt:"DESC"
			},
			relations:{
				author:true,
				comments:{
					author:true
				}
			},
			select:{
				author:{
					id:true,
					name:true,
					avatarPath:true,
					isVerified:true,
				}
			}
		})

		return videos	
	}

	async getVideoById(id:number, isPublic = false){
		const video = await this.VideoRepository.findOne({
			where: isPublic ? {
				id, isPublic:true
			}:{
				id
			},
			relations:{
				author:true,
				comments:{
					author:true
				}
			},
			select:{
				author:{
					id:true,
					name:true,
					avatarPath:true,
					subscribersCount:true,
					isVerified:true,
					subscriptions:true
				},
				comments:{
					commentText:true,
					id:true,
					author:{
						id:true,
					name:true,
					avatarPath:true,
					subscribersCount:true,
					isVerified:true,
					}
				}
			}
		})
		if(!video) throw new NotFoundException("Video isn`t exist")
		return video
	}

	async createVideo(userId:number){

		const defaultValues = {
			name:"",
			author:{id:userId},
			description:"",
			videoPath:"",
			thumbnailPath:""
		}

		const video = this.VideoRepository.create(defaultValues)
		await this.VideoRepository.save(video)
		return video.id
	}

	async deleteVideo(videoId:number){
		await this.CommentRepository.delete({video:{id:videoId}})
		return this.VideoRepository.delete({id:videoId})
	}

	async updateVideo(videoId:number, dto:VideoDto){
		const video = await this.VideoRepository.findOneBy({id:videoId})

		return this.VideoRepository.save({
			...video, ...dto, duration:Math.round(dto.duration/60)
		})
	}

	async updateViewsCount(videoId:number){
		const video = await this.getVideoById(videoId)
		video.views++
		return this.VideoRepository.save(video)
	}

	async updateLikesCount(videoId:number){
		const video = await this.getVideoById(videoId)
		video.likes++
		return this.VideoRepository.save(video)
	}

	async getMostPopular(){
		const videos = await this.VideoRepository.find({
			where:{
				views:MoreThan(0)
			},
			relations:{
				author:true
			},
			select:{
				author:{
					id:true,
					name:true,
					avatarPath:true,
					isVerified:true,
				}
			},
			order:{
				views:-1
			}
		})
		return videos
	}
}