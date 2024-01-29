import { IsOptional, IsUUID } from 'class-validator';

export class GetFoldersQuery {
  @IsUUID()
  @IsOptional()
  folderId?: string;
}
