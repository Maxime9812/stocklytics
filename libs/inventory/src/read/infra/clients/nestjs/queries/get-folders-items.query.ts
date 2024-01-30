import { IsOptional, IsUUID } from 'class-validator';

export class GetFoldersItemsQuery {
  @IsUUID()
  @IsOptional()
  folderId?: string;
}
