import { IsUUID, Length } from 'class-validator';

export class CreateNewFolderDto {
  @IsUUID()
  id: string;
  @Length(1, 100)
  name: string;
}
