"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createReviewDto) {
        const { productId, rating, comment } = createReviewDto;
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const hasPurchased = await this.prisma.order.findFirst({
            where: {
                userId,
                status: 'COMPLETED',
                items: {
                    some: {
                        productId,
                    },
                },
            },
        });
        if (!hasPurchased) {
            throw new common_1.BadRequestException('You can only review products you have purchased');
        }
        const existingReview = await this.prisma.review.findFirst({
            where: {
                userId,
                productId,
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this product. Please update your existing review.');
        }
        const review = await this.prisma.review.create({
            data: {
                userId,
                productId,
                rating,
                comment,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });
        await this.updateProductRating(productId);
        return review;
    }
    async findByProduct(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const reviews = await this.prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const ratingDistribution = {
            5: reviews.filter((r) => r.rating === 5).length,
            4: reviews.filter((r) => r.rating === 4).length,
            3: reviews.filter((r) => r.rating === 3).length,
            2: reviews.filter((r) => r.rating === 2).length,
            1: reviews.filter((r) => r.rating === 1).length,
        };
        return {
            reviews,
            total: reviews.length,
            averageRating: product.rating,
            ratingDistribution,
        };
    }
    async update(id, userId, updateReviewDto) {
        const review = await this.prisma.review.findUnique({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own reviews');
        }
        const updatedReview = await this.prisma.review.update({
            where: { id },
            data: updateReviewDto,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    },
                },
            },
        });
        await this.updateProductRating(review.productId);
        return updatedReview;
    }
    async remove(id, userId) {
        const review = await this.prisma.review.findUnique({
            where: { id },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own reviews');
        }
        await this.prisma.review.delete({
            where: { id },
        });
        await this.updateProductRating(review.productId);
        return { message: 'Review deleted successfully' };
    }
    async updateProductRating(productId) {
        const reviews = await this.prisma.review.findMany({
            where: { productId },
            select: { rating: true },
        });
        if (reviews.length === 0) {
            await this.prisma.product.update({
                where: { id: productId },
                data: { rating: 0 },
            });
            return;
        }
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Number((totalRating / reviews.length).toFixed(1));
        await this.prisma.product.update({
            where: { id: productId },
            data: { rating: averageRating },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map