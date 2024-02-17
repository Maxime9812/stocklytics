import { IsString, MaxLength } from 'class-validator';

export class ChangeItemNameDto {
  @IsString()
  @MaxLength(100)
  name: string;
}
