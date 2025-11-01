import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: any, createReviewDto: CreateReviewDto): Promise<{
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
    update(id: string, req: any, updateReviewDto: UpdateReviewDto): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
