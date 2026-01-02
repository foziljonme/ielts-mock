import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { DemosModule } from './demos/demos.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { TOKEN_EXPIRES_IN } from './common/constants';
import { PlatformModule } from './platform/platform.module';
import { ConfigModule } from './config/config.module';
import { TenantResolverMiddleware } from './middlewares/tenant-resolver.middleware';
import { RouterModule } from '@nestjs/core';
import { TestModule } from './test/test.module';
import { SectionsModule } from './test/sections/sections.module';
import { PassagesModule } from './test/passages/passages.module';
import { UploadModule } from './test/uploads/upload.module';
import { AudiosModule } from './test/audios/audios.module';
import { QuestionsModule } from './test/questions/questions.module';
import { OptionsModule } from './test/options/options.module';

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
        // other transports...
      ],
      // other options
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: TOKEN_EXPIRES_IN },
    }),
    RouterModule.register([
      {
        path: 'platform',
        module: PlatformModule,
      },
    ]),
    PlatformModule,
    DemosModule,
    AuthModule,
    PrismaModule,
    ConfigModule,
    TestModule,
    SectionsModule,
    PassagesModule,
    UploadModule,
    AudiosModule,
    QuestionsModule,
    OptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantResolverMiddleware).forRoutes('*'); // ✅ Global
  }
}
