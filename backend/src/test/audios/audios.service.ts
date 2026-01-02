import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  type LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, TestModule } from 'prisma/generated/client';
import { CreateAudioDto } from './dto/create-audio.dto';
import { UpdateAudioDto } from './dto/update-audio.dto';
import { SearchAudioDto } from './dto/search-audio.dto';

@Injectable()
export class AudiosService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(
    sectionId: string,
    createAudioDto: CreateAudioDto,
    tx: Prisma.TransactionClient,
  ) {
    this.logger.log('Creating audio');
    const section = await tx.testSection.findUnique({
      where: { id: sectionId },
      include: {
        listeningAudio: true,
      },
    });

    if (!section) {
      throw new NotFoundException('Test section not found');
    }

    if (section.module !== TestModule.LISTENING) {
      throw new BadRequestException(
        'Audio can only be created for listening section',
      );
    }

    if (section?.listeningAudio) {
      throw new BadRequestException('Audio already exists for this section');
    }

    const audio = await tx.listeningAudio.create({
      data: {
        ...createAudioDto,
        sectionId,
      },
    });

    return audio;
  }

  async createWithTx(sectionId: string, createAudioDto: CreateAudioDto) {
    return await this.prismaService.$transaction(async (tx) => {
      return await this.create(sectionId, createAudioDto, tx);
    });
  }

  async findAll(searchAudioDto: SearchAudioDto) {
    this.logger.log({ message: 'Finding all audios', searchAudioDto });
    const { sectionId } = searchAudioDto;
    return await this.prismaService.listeningAudio.findMany({
      where: { sectionId },
    });
  }

  async findOne(audioId: string) {
    this.logger.log({ message: 'Finding audio', audioId });
    const result = await this.prismaService.listeningAudio.findUnique({
      where: { id: audioId },
    });

    if (!result) {
      throw new NotFoundException('Audio not found');
    }

    return result;
  }

  async update(audioId: string, updateAudioDto: UpdateAudioDto) {
    this.logger.log('Updating audio');
    return await this.prismaService.listeningAudio.update({
      where: { id: audioId },
      data: updateAudioDto,
    });
  }

  async delete(audioId: string) {
    this.logger.log('Deleting audio');
    const deletedSection = await this.prismaService.listeningAudio.delete({
      where: { id: audioId },
    });

    return { success: true, section: deletedSection };
  }
}
