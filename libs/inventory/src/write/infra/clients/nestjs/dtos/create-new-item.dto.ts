import { IsUUID, Length, Min } from 'class-validator';

export class CreateNewItemDto {
  @IsUUID()
  id: string;
  @Length(1, 100)
  name: string;
  @Min(0)
  quantity: number;
}
