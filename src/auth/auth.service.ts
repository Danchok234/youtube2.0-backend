import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    return {
      user: this.returnUserFields(user),
      accessToken: await this.issueAccessToken(user.id),
    };
  }

  async register(dto: AuthDto) {
    await this.userService.getOldUser(dto.email);

    const newUser = this.UserRepository.create({
      email: dto.email,
      password: await argon2.hash(dto.password),
    });

    const user = await this.UserRepository.save(newUser);

		await this.UserRepository.update({ id: user.id }, {
			...user,
      name: `user${user.id}`,
		});

    return {
      user: this.returnUserFields(user),
      accessToken: await this.issueAccessToken(user.id),
    };
  }

  async validateUser(dto: AuthDto) {
    const user = await this.UserRepository.findOne({
      where: {
        email: dto.email,
      },
      select: ['id', 'email', 'password'],
    });

    if (!user) throw new NotFoundException('User isn`t exist');

    const isPasswordMatch = await argon2.verify(user.password, dto.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Password is incorrect!');

    return user;
  }

  async issueAccessToken(userId: number) {
    const data = {
      id: userId,
    };

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '31d',
    });

    return accessToken;
  }

  returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
