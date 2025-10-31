import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shopId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['COD', 'CARD', 'BANK_TRANSFER'])
  paymentMethod: 'COD' | 'CARD' | 'BANK_TRANSFER';
}
