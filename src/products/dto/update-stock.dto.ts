import { IsInt, Min, Max } from 'class-validator';

export class UpdateStockDto {
  @IsInt()
  @Min(0)
  @Max(999999)
  quantity: number;
}
