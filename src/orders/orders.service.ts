import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Generate unique order number
  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
  }

  async create(userId: string, createOrderDto: CreateOrderDto) {
    // Verify shop exists
    const shop = await this.prisma.shop.findUnique({
      where: { id: createOrderDto.shopId },
    });

    if (!shop || !shop.isActive) {
      throw new NotFoundException('Shop not found or inactive');
    }

    // Verify all products and calculate total
    let totalAmount = 0;
    const orderItems: Array<{
      productId: string;
      quantity: number;
      price: number;
    }> = [];

    for (const item of createOrderDto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.isActive) {
        throw new NotFoundException(
          `Product ${item.productId} not found or inactive`,
        );
      }

      if (product.shopId !== createOrderDto.shopId) {
        throw new BadRequestException(
          `Product ${item.productId} does not belong to shop ${createOrderDto.shopId}`,
        );
      }

      const quantity = Number(item.quantity);
      if (product.stock < quantity) {
        throw new BadRequestException(
          `Product "${product.name}" only has ${product.stock} items in stock`,
        );
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

    // Create order with transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
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

      // Update product stock and sold count
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      // Clear cart items for this shop
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

  async findAll(params?: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    shopId?: string;
    userId?: string;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

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

  async findUserOrders(userId: string, page = 1, limit = 10) {
    return this.findAll({ page, limit, userId });
  }

  async findShopOrders(shopId: string, ownerId: string, page = 1, limit = 10) {
    // Verify user owns the shop
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    if (shop.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You can only view orders from your own shop',
      );
    }

    return this.findAll({ page, limit, shopId });
  }

  async findOne(id: string, userId: string) {
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
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Only order owner or shop owner can view
    if (order.userId !== userId && order.shop.ownerId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this order',
      );
    }

    return order;
  }

  async updateStatus(
    id: string,
    userId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        shop: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Only shop owner can update order status
    if (order.shop.ownerId !== userId) {
      throw new ForbiddenException('Only shop owner can update order status');
    }

    // Validate status transitions
    const { status } = updateOrderStatusDto;
    const currentStatus = order.status;

    // Business logic for status transitions
    if (currentStatus === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot update cancelled order');
    }

    if (currentStatus === OrderStatus.COMPLETED) {
      throw new BadRequestException('Cannot update completed order');
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

  async cancel(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Only order owner can cancel
    if (order.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    // Can only cancel pending or paid orders
    const cancellableStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.PAID,
    ];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException(
        `Cannot cancel order with status ${order.status}`,
      );
    }

    // Restore product stock
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
        data: { status: OrderStatus.CANCELLED },
      });
    });

    return { message: 'Order cancelled successfully' };
  }
}
