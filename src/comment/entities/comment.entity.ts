import { UserEntity } from 'src/user/entities/user.entity';
import { Base } from 'src/utils/base';
import { VideoEntity } from 'src/video/entities/video.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('Comment')
export class CommentEntity extends Base {
  @ManyToOne(() => UserEntity, (user) => user.videos)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @Column({ default: 0 })
  likes?: number;

  @Column({ default: '', type: 'text', name:"comment_text" })
  commentText: string;

	@ManyToOne(()=>VideoEntity, video=> video.comments)
	@JoinColumn({name:"video_id"})
	video:VideoEntity

}
