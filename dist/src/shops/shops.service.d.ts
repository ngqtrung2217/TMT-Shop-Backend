import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
export declare class ShopsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createShopDto: CreateShopDto): Promise<{
        owner: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo: string | null;
        banner: string | null;
        rating: number;
        ownerId: string;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            _count: {
                products: number;
            };
            owner: {
                id: string;
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            logo: string | null;
            banner: string | null;
            rating: number;
            ownerId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findUserShops(userId: string): Promise<({
        _count: {
            orders: number;
            products: number;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo: string | null;
        banner: string | null;
        rating: number;
        ownerId: string;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            orders: number;
            products: number;
        };
        owner: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo: string | null;
        banner: string | null;
        rating: number;
        ownerId: string;
    }>;
    update(id: string, userId: string, updateShopDto: UpdateShopDto): Promise<{
        owner: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo: string | null;
        banner: string | null;
        rating: number;
        ownerId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    checkOwnership(shopId: string, userId: string): Promise<boolean>;
}
