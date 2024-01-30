import { IsOptional, IsUUID } from 'class-validator';

export class GetFoldersInFolderQuery {
  @IsUUID()
  @IsOptional()
  folderId?: string;
}
