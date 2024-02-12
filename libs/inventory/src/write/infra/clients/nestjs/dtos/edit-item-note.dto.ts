import { IsString, MaxLength } from 'class-validator';

export class EditItemNoteDto {
  @IsString()
  @MaxLength(300)
  note: string;
}
