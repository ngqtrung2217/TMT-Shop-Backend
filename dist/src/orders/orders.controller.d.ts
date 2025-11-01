import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<{
        shop: {
            id: string;
            name: string;
            logo: string | null;
        };
        items: ({
            product: {
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
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopId: string;
        paymentMethod: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        orderNumber: string;
        totalAmount: number;
        shippingAddress: string;
    }>;
    findAll(page?: number, limit?: number, status?: OrderStatus): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
            shop: {
                id: string;
                name: string;
                logo: string | null;
            };
            items: ({
                product: {
                    id: string;
                    name: string;
                    price: number;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                price: number;
                quantity: number;
                productId: string;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shopId: string;
            paymentMethod: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            totalAmount: number;
            shippingAddress: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findUserOrders(userId: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
            shop: {
                id: string;
                name: string;
                logo: string | null;
            };
            items: ({
                product: {
                    id: string;
                    name: string;
                    price: number;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                price: number;
                quantity: number;
                productId: string;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shopId: string;
            paymentMethod: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            totalAmount: number;
            shippingAddress: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findShopOrders(shopId: string, userId: string, page?: number, limit?: number): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
            shop: {
                id: string;
                name: string;
                logo: string | null;
            };
            items: ({
                product: {
                    id: string;
                    name: string;
                    price: number;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                price: number;
                quantity: number;
                productId: string;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            shopId: string;
            paymentMethod: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            orderNumber: string;
            totalAmount: number;
            shippingAddress: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, userId: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
        };
        shop: {
            id: string;
            name: string;
            logo: string | null;
            ownerId: string;
        };
        items: ({
            product: {
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
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopId: string;
        paymentMethod: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        orderNumber: string;
        totalAmount: number;
        shippingAddress: string;
    }>;
    updateStatus(id: string, userId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<{
        shop: {
            id: string;
            name: string;
            logo: string | null;
        };
        items: ({
            product: {
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
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        shopId: string;
        paymentMethod: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        orderNumber: string;
        totalAmount: number;
        shippingAddress: string;
    }>;
    cancel(id: string, userId: string): Promise<{
        message: string;
    }>;
}
