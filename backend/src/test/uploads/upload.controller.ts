import {
  Controller,
  Inject,
  type LoggerService,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadResponseDto } from './dto/upload-response.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { uploadConfig } from './upload.config';
import { UploadService } from './upload.service';

@Controller('uploads')
export class UploadController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('test')
  @UseInterceptors(FileInterceptor('file', uploadConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    this.logger.log(file);
    return file;
  }

  // Single audio upload
  // @Post('single')
  // @UseInterceptors(FileInterceptor('file', uploadConfig))
  // uploadSingle(@UploadedFile() file: Express.Multer.File) {
  //   return file;
  // }

  // Multiple audio upload
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10, uploadConfig))
  uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
  ): Express.Multer.File[] {
    return files;
  }

  @Post('merge')
  @UseInterceptors(FilesInterceptor('files', 10, uploadConfig))
  mergeAudioFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadResponseDto> {
    return this.uploadService.mergeAudioFiles(files);
  }
}
