import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ContextStorageServiceKey } from './config/contextStorage.service';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.enableCors({
    origin: [
      'http://localhost:3000', // Vite default port
      /http:\/\/(.+\.)?localhost:3000$/,
      'http://172.31.227.158:3000',
      'http://localhost:8000', // Custom port
      /http:\/\/(.+\.)?localhost:8000$/,
      'http://172.31.227.158:8000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed methods
    credentials: true, // If you need to handle cookies/sessions
  });
  // Apply JWT guard globally, but allow @Public() to bypass
  app.useGlobalGuards(
    new JwtAuthGuard(logger, app.get(JwtService), app.get(Reflector)),
    new RolesGuard(app.get(Reflector)),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
