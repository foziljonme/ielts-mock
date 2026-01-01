import { Inject, Injectable, type LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class DemosService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  create(createDemoDto: any) {
    this.logger.log('Creating demo', createDemoDto);
    return 'This action adds a new demo';
  }

  listAll() {
    this.logger.log({
      message: 'Listing all demos',
      someShit: 'someShit',
      someOtherShit: 'I am different shit',
      name: 'John Doe',
    });

    return `This action returns all demos`;
  }
}
