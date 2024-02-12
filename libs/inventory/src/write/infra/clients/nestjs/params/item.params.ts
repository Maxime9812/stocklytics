import { IsUUID } from 'class-validator';

export class ItemParams {
  @IsUUID()
  itemId: string;
}
