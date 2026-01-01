import { IsNumber, IsString } from 'class-validator';

export class CreateAudioDto {
  @IsString()
  audioUrl: string;

  @IsNumber()
  durationSec: number;
}
