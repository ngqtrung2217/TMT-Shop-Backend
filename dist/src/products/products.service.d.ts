import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto, userId: string): Promise<{
        shop: {
            id: string;
            name: string;
            logo: string | null;
        };
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        discount: number;
        stock: number;
        images: string[];
        isActive: boolean;
        rating: number;
        soldCount: number;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        categoryId: string | null;
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
            shop: {
                id: string;
                name: string;
                rating: number;
                logo: string | null;
            };
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
            name: string;
            description: string | null;
            price: number;
            discount: number;
            stock: number;
            images: string[];
            isActive: boolean;
            rating: number;
            soldCount: number;
            createdAt: Date;
            updatedAt: Date;
            shopId: string;
            categoryId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        shop: {
            id: string;
            name: string;
            rating: number;
            logo: string | null;
            banner: string | null;
            ownerId: string;
        };
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        reviews: ({
            user: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
            };
        } & {
            id: string;
            rating: number;
            createdAt: Date;
            updatedAt: Date;
            comment: string | null;
            userId: string;
            productId: string;
        })[];
        _count: {
            reviews: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        discount: number;
        stock: number;
        images: string[];
        isActive: boolean;
        rating: number;
        soldCount: number;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        categoryId: string | null;
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
        name: string;
        description: string | null;
        price: number;
        discount: number;
        stock: number;
        images: string[];
        isActive: boolean;
        rating: number;
        soldCount: number;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        categoryId: string | null;
    })[]>;
    update(id: string, updateProductDto: UpdateProductDto, userId: string): Promise<{
        shop: {
            id: string;
            name: string;
            logo: string | null;
        };
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        discount: number;
        stock: number;
        images: string[];
        isActive: boolean;
        rating: number;
        soldCount: number;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        categoryId: string | null;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    updateStock(id: string, quantity: number, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        discount: number;
        stock: number;
        images: string[];
        isActive: boolean;
        rating: number;
        soldCount: number;
        createdAt: Date;
        updatedAt: Date;
        shopId: string;
        categoryId: string | null;
    }>;
}
