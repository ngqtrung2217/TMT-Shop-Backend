import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEnum,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
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
  address: string;

  @IsString()
  @IsNotEmpty()
  provinceCode: string;

  @IsString()
  @IsNotEmpty()
  provinceName: string;

  @IsString()
  @IsNotEmpty()
  communeCode: string;

  @IsString()
  @IsNotEmpty()
  communeName: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['COD', 'CARD', 'BANK_TRANSFER'])
  paymentMethod: 'COD' | 'CARD' | 'BANK_TRANSFER';
}
