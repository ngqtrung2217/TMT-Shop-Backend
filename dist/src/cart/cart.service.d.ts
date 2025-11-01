import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    private getOrCreateCart;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<{
        product: {
            shop: {
                id: string;
                name: string;
                logo: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            rating: number;
            categoryId: string | null;
            price: number;
            discount: number;
            stock: number;
            images: string[];
            shopId: string;
            soldCount: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        productId: string;
        cartId: string;
    }>;
    getCart(userId: string): Promise<{
        cart: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
        items: ({
            product: {
                shop: {
                    id: string;
                    name: string;
                    logo: string | null;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                rating: number;
                categoryId: string | null;
                price: number;
                discount: number;
                stock: number;
                images: string[];
                shopId: string;
                soldCount: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            productId: string;
            cartId: string;
        })[];
        summary: {
            itemCount: number;
            totalQuantity: number;
            totalAmount: number;
        };
    }>;
    updateCartItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto): Promise<{
        product: {
            shop: {
                id: string;
                name: string;
                logo: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            rating: number;
            categoryId: string | null;
            price: number;
            discount: number;
            stock: number;
            images: string[];
            shopId: string;
            soldCount: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        productId: string;
        cartId: string;
    }>;
    removeFromCart(userId: string, itemId: string): Promise<{
        message: string;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
}
