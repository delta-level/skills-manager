import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';

import { AuthModule } from './auth/auth.module';
import { dataSourceOptions } from './db/data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.local',
        `.env.${process.env.NODE_ENV || 'dev'}.local`,
        `.env.${process.env.NODE_ENV || 'dev'}`,
        '.env',
      ],
    }),
    UsersModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
