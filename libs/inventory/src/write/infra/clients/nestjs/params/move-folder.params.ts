import { IsUUID } from 'class-validator';

export class MoveFolderParams {
  @IsUUID()
  folderId: string;
}
