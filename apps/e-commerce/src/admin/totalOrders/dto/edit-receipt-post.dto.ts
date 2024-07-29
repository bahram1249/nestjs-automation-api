import { IsString } from 'class-validator';

export class EditReceiptPostDto {
  @IsString()
  receipt: string;
}
