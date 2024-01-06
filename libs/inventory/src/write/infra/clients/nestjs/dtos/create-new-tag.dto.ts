import { IsUUID, Length } from 'class-validator';

export class CreateNewTagDto {
  @IsUUID()
  id: string;
  @Length(1, 100)
  name: string;
}
