import { IsOptional, IsUUID } from 'class-validator';

export class MoveItemIntoFolderDto {
  @IsUUID()
  @IsOptional()
  folderId?: string;
}
