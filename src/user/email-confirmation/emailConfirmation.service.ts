import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
}
