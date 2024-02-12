import { IsUUID } from 'class-validator';

export class FolderParams {
  @IsUUID()
  folderId: string;
}
