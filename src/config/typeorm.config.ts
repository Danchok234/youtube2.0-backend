import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: 'mahmud.db.elephantsql.com',
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DATABASE'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
});
