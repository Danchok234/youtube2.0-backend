import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { IVerificationTokenPayload } from './dto/verificationTokenPayload.interface';
import { SubscriptionEntity } from './entities/subscription.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly SubscriptionRepository: Repository<SubscriptionEntity>,
    private configService: ConfigService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async getAllUsers() {
    return this.UserRepository.find();
  }

  async getOldUser(email: string) {
    const oldUser = await this.UserRepository.findOne({
      where: {
        email,
      },
    });

    if (oldUser) throw new BadRequestException('User is already exist!');
  }

  async getUserById(id: number) {
    const user = await this.UserRepository.findOne({
      where: {
        id,
      },
      relations: {
        videos: true,
        subscriptions: {
          toChannel: {
            videos: true,
          },
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!user) throw new NotFoundException('User wasn`t found!');

    return user;
  }

  async subscribe(fromId: number, toChannelId: number) {
    const channelToSubscribe = await this.getUserById(toChannelId);

    const data = {
      toChannel: { id: toChannelId },
      fromUser: { id: fromId },
    };

    const isSubscribed = await this.SubscriptionRepository.findOneBy(data);

    if (!isSubscribed) {
      const newSubscription = this.SubscriptionRepository.create(data);
      await this.SubscriptionRepository.save(newSubscription);
      channelToSubscribe.subscribersCount++;
      await this.UserRepository.save(channelToSubscribe);
      return true;
    }

    await this.SubscriptionRepository.delete(data);
    channelToSubscribe.subscribersCount--;
    await this.UserRepository.save(channelToSubscribe);
    return false;
  }

  async updateProfile(currentId: number, updateUserId: number, dto: UserDto) {
    if (currentId !== updateUserId)
      throw new ForbiddenException(
        'You can`t update information of another user!',
      );

    const user = await this.getUserById(updateUserId);

    const isSameUser = await this.UserRepository.findOne({
      where: { email: user.email },
    });
    if (isSameUser && updateUserId !== isSameUser.id)
      throw new BadRequestException('Email is already taken!');

    if (dto.password) {
      user.password = await hash(dto.password);
    }
    user.email = dto.email;
    user.description = dto.description;
    user.name = dto.name;
    user.avatarPath = dto.avatarPath;

    return this.UserRepository.save(user);
  }

  async markEmailAsVerified(email: string) {
    return this.UserRepository.update(
      { email },
      {
        isVerified: true,
      },
    );
  }

  async sendVerificationLink(email: string) {
    const { id } = await this.UserRepository.findOneBy({ email });

    const payload: IVerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '31d',
    });

    const url = `${this.configService.get(
      'EMAIL_CONFIRM_URL',
    )}/${id}?token=${token}`;

    const text = `Welcome to YOUTUBE 2.0. In order to confirm your email address, click here:${url}`;

    return this.emailService.sendEmail({
      to: email,
      subject: 'Email Verification',
      text,
    });
  }

  async confirmEmail(email: string) {
    const user = await this.UserRepository.findOneBy({ email });
    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }
    await this.markEmailAsVerified(email);
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async resendConfirmationLink(userId: number) {
    const user = await this.getUserById(userId);
    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }
    await this.sendVerificationLink(user.email);
  }
}
