export declare class OrderItemDto {
    productId: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    shopId: string;
    items: OrderItemDto[];
    address: string;
    provinceCode: string;
    provinceName: string;
    communeCode: string;
    communeName: string;
    paymentMethod: 'COD' | 'CARD' | 'BANK_TRANSFER';
}
