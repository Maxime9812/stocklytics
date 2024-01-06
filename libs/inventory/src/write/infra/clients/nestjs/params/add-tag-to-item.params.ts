import { IsUUID } from 'class-validator';

export class AddTagToItemParams {
  @IsUUID()
  itemId: string;
  @IsUUID()
  tagId: string;
}
