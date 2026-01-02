import { Injectable, InternalServerErrorException } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class UploadService {
  async mergeAudioFiles(
    files: Express.Multer.File[],
  ): Promise<UploadResponseDto> {
    if (!files.length) {
      throw new InternalServerErrorException('No files provided');
    }

    const outputFilename = `${Date.now()}-merged.mp3`;
    const outputPath = join('uploads', outputFilename);

    return new Promise((resolve, reject) => {
      const command = ffmpeg();

      // Add all input files
      files.forEach((file) => command.input(file.path));

      command
        .on('error', (err) => reject(err))
        .on('end', async () => {
          // Cleanup temp files
          await Promise.all(files.map((file) => unlink(file.path)));

          resolve({
            filename: outputFilename,
            originalName: 'merged-audio.mp3',
            mimeType: 'audio/mpeg',
            size: 0, // optional: stat file if needed
            path: outputPath,
            url: `/uploads/${outputFilename}`,
          });
        })
        .mergeToFile(outputPath);
    });
  }
}
