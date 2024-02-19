import { IsNumber } from 'class-validator';

export class AdjustItemQuantityDto {
  @IsNumber()
  quantity: number;
}
