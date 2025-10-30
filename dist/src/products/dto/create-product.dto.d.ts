export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    discount?: number;
    stock: number;
    images?: string[];
    shopId: string;
    categoryId?: string;
}
