import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	
	@IsEmail()
	email: string

	@MinLength(8, {message:"Your email should contain more than 8 characters"})
	@IsString()
	password:string

}
