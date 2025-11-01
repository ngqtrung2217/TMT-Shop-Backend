import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto, userId: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
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
    }>;
    findAll(params?: {
        page?: number;
        limit?: number;
        search?: string;
        categoryId?: string;
        shopId?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: 'createdAt' | 'price' | 'soldCount' | 'rating';
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                slug: string;
            } | null;
            shop: {
                id: string;
                name: string;
                logo: string | null;
                rating: number;
            };
            _count: {
                reviews: number;
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        reviews: ({
            user: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            rating: number;
            productId: string;
            comment: string | null;
        })[];
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        shop: {
            id: string;
            name: string;
            logo: string | null;
            banner: string | null;
            ownerId: string;
            rating: number;
        };
        _count: {
            reviews: number;
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
    }>;
    findShopProducts(shopId: string, userId: string): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        _count: {
            reviews: number;
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
    })[]>;
    update(id: string, updateProductDto: UpdateProductDto, userId: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
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
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    updateStock(id: string, quantity: number, userId: string): Promise<{
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
    }>;
}
