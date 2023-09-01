import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserDto{
  @IsEmail()
  email: string;

	@IsString()
	@MinLength(8)
  @IsOptional()
	password: string;
	
	@IsString()
	avatarPath: string
	
	@IsString()
	name: string
	
	@IsString()
	description: string
	
}
