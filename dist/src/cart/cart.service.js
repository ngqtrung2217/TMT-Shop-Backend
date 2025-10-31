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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
            });
        }
        return cart;
    }
    async addToCart(userId, addToCartDto) {
        const product = await this.prisma.product.findUnique({
            where: { id: addToCartDto.productId },
            include: { shop: true },
        });
        if (!product || !product.isActive) {
            throw new common_1.NotFoundException('Product not found or inactive');
        }
        if (product.stock < addToCartDto.quantity) {
            throw new common_1.BadRequestException(`Only ${product.stock} items available in stock`);
        }
        const cart = await this.getOrCreateCart(userId);
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: addToCartDto.productId,
                },
            },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + addToCartDto.quantity;
            if (newQuantity > product.stock) {
                throw new common_1.BadRequestException(`Cannot add ${addToCartDto.quantity} more items. Only ${product.stock - existingItem.quantity} available`);
            }
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
                include: {
                    product: {
                        include: {
                            shop: {
                                select: {
                                    id: true,
                                    name: true,
                                    logo: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: addToCartDto.productId,
                quantity: addToCartDto.quantity,
            },
            include: {
                product: {
                    include: {
                        shop: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async getCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        const items = await this.prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: {
                product: {
                    include: {
                        shop: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        const total = items.reduce((sum, item) => {
            const price = item.product.price;
            const discount = item.product.discount || 0;
            const finalPrice = price - (price * discount) / 100;
            return sum + finalPrice * item.quantity;
        }, 0);
        return {
            cart,
            items,
            summary: {
                itemCount: items.length,
                totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
                totalAmount: total,
            },
        };
    }
    async updateCartItem(userId, itemId, updateCartItemDto) {
        const cart = await this.getOrCreateCart(userId);
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
            include: { product: true },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        if (cartItem.product.stock < updateCartItemDto.quantity) {
            throw new common_1.BadRequestException(`Only ${cartItem.product.stock} items available in stock`);
        }
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: updateCartItemDto.quantity },
            include: {
                product: {
                    include: {
                        shop: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async removeFromCart(userId, itemId) {
        const cart = await this.getOrCreateCart(userId);
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        return { message: 'Item removed from cart successfully' };
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return { message: 'Cart cleared successfully' };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map