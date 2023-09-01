import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/user/decorators/current-user.decorator'
import { VideoDto } from './dto/video.dto'
import { VideoService } from './video.service'

@Controller("video")
export class VideoController{
	constructor(private readonly videoService:VideoService){}

	@Get(`get-private/:id`)
	@Auth()
	async getPrivateVideo(@Param("id") id:string){
		return this.videoService.getVideoById(+id)
	}

	@Get(`by-id/:id`)
	async getVideo(@Param("id") id:string){
	return this.videoService.getVideoById(+id)
	}

	@Get()
	async getAll(@Query("searchTerm") searchTerm?:string){
		return this.videoService.getAllVideos(searchTerm)
	}

	@Post()
	@Auth()
	@HttpCode(200)
	async createVideo(@CurrentUser("id") id:number){
		return this.videoService.createVideo(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(`:id`)
	@Auth()
	async updateVideo(@Param("id") id:string, @Body() dto:VideoDto){
		return this.videoService.updateVideo(+id, dto)
	}

	@Get("most-popular")
	async getMostPopular(){
		return this.videoService.getMostPopular()
	}

	@HttpCode(200)
	@Delete(`:id`)
	@Auth()
	async deleteVideo(@Param("id") id:string){
		return this.videoService.deleteVideo(+id)
	}

	@HttpCode(200)
	@Patch(`update-views/:id`)
	async updateViews(@Param("id") id:string){
		return this.videoService.updateViewsCount(+id)
	}

	@HttpCode(200)
	@Patch(`update-likes/:id`)
	async updateLikes(@Param("id") id:string){
		return this.videoService.updateLikesCount(+id)
	}
}