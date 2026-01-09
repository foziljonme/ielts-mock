import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SESSION_TOKEN_EXPIRES_IN } from './common/constants';
import { PlatformModule } from './platform/platform.module';
import { ConfigModule } from './config/config.module';
import { RouterModule } from '@nestjs/core';
import { ExamsModule } from './exams/exams.module';
import { TenantResolverMiddleware } from './middlewares/tenant-resolver.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
      ],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: SESSION_TOKEN_EXPIRES_IN },
    }),
    EventEmitterModule.forRoot(),
    RouterModule.register([
      {
        path: 'platform',
        module: PlatformModule,
      },
    ]),
    PlatformModule,
    AuthModule,
    PrismaModule,
    ConfigModule,
    ExamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantResolverMiddleware).forRoutes('*');
  }
}
