import { IsUUID } from 'class-validator';

export class MoveItemIntoFolderParams {
  @IsUUID()
  itemId: string;
}
