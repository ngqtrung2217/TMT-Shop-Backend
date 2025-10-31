export declare class OrderItemDto {
    productId: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    shopId: string;
    items: OrderItemDto[];
    shippingAddress: string;
    paymentMethod: 'COD' | 'CARD' | 'BANK_TRANSFER';
}
