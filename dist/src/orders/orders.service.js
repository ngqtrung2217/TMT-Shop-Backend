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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, '0');
        return `ORD-${timestamp}-${random}`;
    }
    async create(userId, createOrderDto) {
        const shop = await this.prisma.shop.findUnique({
            where: { id: createOrderDto.shopId },
        });
        if (!shop || !shop.isActive) {
            throw new common_1.NotFoundException('Shop not found or inactive');
        }
        let totalAmount = 0;
        const orderItems = [];
        for (const item of createOrderDto.items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product || !product.isActive) {
                throw new common_1.NotFoundException(`Product ${item.productId} not found or inactive`);
            }
            if (product.shopId !== createOrderDto.shopId) {
                throw new common_1.BadRequestException(`Product ${item.productId} does not belong to shop ${createOrderDto.shopId}`);
            }
            const quantity = Number(item.quantity);
            if (product.stock < quantity) {
                throw new common_1.BadRequestException(`Product "${product.name}" only has ${product.stock} items in stock`);
            }
            const price = Number(item.price);
            const discount = product.discount || 0;
            const finalPrice = price - (price * discount) / 100;
            orderItems.push({
                productId: item.productId,
                quantity,
                price: finalPrice,
            });
            totalAmount += finalPrice * quantity;
        }
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: this.generateOrderNumber(),
                    userId,
                    shopId: createOrderDto.shopId,
                    totalAmount,
                    shippingAddress: createOrderDto.shippingAddress,
                    paymentMethod: createOrderDto.paymentMethod,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    shop: {
                        select: {
                            id: true,
                            name: true,
                            logo: true,
                        },
                    },
                },
            });
            for (const item of orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        soldCount: { increment: item.quantity },
                    },
                });
            }
            const cart = await tx.cart.findUnique({
                where: { userId },
            });
            if (cart) {
                const productIds = orderItems.map((item) => item.productId);
                await tx.cartItem.deleteMany({
                    where: {
                        cartId: cart.id,
                        productId: { in: productIds },
                    },
                });
            }
            return newOrder;
        });
        return order;
    }
    async findAll(params) {
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (params?.status) {
            where.status = params.status;
        }
        if (params?.shopId) {
            where.shopId = params.shopId;
        }
        if (params?.userId) {
            where.userId = params.userId;
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    shop: {
                        select: {
                            id: true,
                            name: true,
                            logo: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    images: true,
                                    price: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findUserOrders(userId, page = 1, limit = 10) {
        return this.findAll({ page, limit, userId });
    }
    async findShopOrders(shopId, ownerId, page = 1, limit = 10) {
        const shop = await this.prisma.shop.findUnique({
            where: { id: shopId },
        });
        if (!shop) {
            throw new common_1.NotFoundException('Shop not found');
        }
        if (shop.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('You can only view orders from your own shop');
        }
        return this.findAll({ page, limit, shopId });
    }
    async findOne(id, userId) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                shop: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        ownerId: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (order.userId !== userId && order.shop.ownerId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to view this order');
        }
        return order;
    }
    async updateStatus(id, userId, updateOrderStatusDto) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                shop: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (order.shop.ownerId !== userId) {
            throw new common_1.ForbiddenException('Only shop owner can update order status');
        }
        const { status } = updateOrderStatusDto;
        const currentStatus = order.status;
        if (currentStatus === client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot update cancelled order');
        }
        if (currentStatus === client_1.OrderStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot update completed order');
        }
        return this.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                shop: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
            },
        });
    }
    async cancel(id, userId) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own orders');
        }
        const cancellableStatuses = [
            client_1.OrderStatus.PENDING,
            client_1.OrderStatus.PAID,
        ];
        if (!cancellableStatuses.includes(order.status)) {
            throw new common_1.BadRequestException(`Cannot cancel order with status ${order.status}`);
        }
        await this.prisma.$transaction(async (tx) => {
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { increment: item.quantity },
                        soldCount: { decrement: item.quantity },
                    },
                });
            }
            await tx.order.update({
                where: { id },
                data: { status: client_1.OrderStatus.CANCELLED },
            });
        });
        return { message: 'Order cancelled successfully' };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map