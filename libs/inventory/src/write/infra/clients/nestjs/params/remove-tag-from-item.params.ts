import { IsUUID } from 'class-validator';

export class RemoveTagFromItemParams {
  @IsUUID()
  itemId: string;
  @IsUUID()
  tagId: string;
}
