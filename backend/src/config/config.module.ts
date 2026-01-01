import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';
import {
  ContextStorageService,
  ContextStorageServiceKey,
} from './contextStorage.service';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req) => {
          return req.headers['x-request-id'] || uuidv4();
        },
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: ContextStorageServiceKey,
      useClass: ContextStorageService,
    },
  ],
  exports: [ContextStorageServiceKey],
})
export class ConfigModule {}
