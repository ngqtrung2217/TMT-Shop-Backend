import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createReviewDto: CreateReviewDto): Promise<{
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
        comment: string | null;
        productId: string;
    }>;
    findByProduct(productId: string): Promise<{
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
            comment: string | null;
            productId: string;
        })[];
        total: number;
        averageRating: number;
        ratingDistribution: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    }>;
    update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<{
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
        comment: string | null;
        productId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    private updateProductRating;
}
