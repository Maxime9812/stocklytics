import { IsUUID } from 'class-validator';

export class AddImageToItemDto {
  @IsUUID()
  imageId: string;
}
