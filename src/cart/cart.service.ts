import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Get or create cart for user
  private async getOrCreateCart(userId: string) {
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

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    // Verify product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: addToCartDto.productId },
      include: { shop: true },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or inactive');
    }

    // Check stock availability
    if (product.stock < addToCartDto.quantity) {
      throw new BadRequestException(
        `Only ${product.stock} items available in stock`,
      );
    }

    const cart = await this.getOrCreateCart(userId);

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: addToCartDto.productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + addToCartDto.quantity;

      if (newQuantity > product.stock) {
        throw new BadRequestException(
          `Cannot add ${addToCartDto.quantity} more items. Only ${product.stock - existingItem.quantity} available`,
        );
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

    // Create new cart item
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

  async getCart(userId: string) {
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

    // Calculate total
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

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock
    if (cartItem.product.stock < updateCartItemDto.quantity) {
      throw new BadRequestException(
        `Only ${cartItem.product.stock} items available in stock`,
      );
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

  async removeFromCart(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Item removed from cart successfully' };
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'Cart cleared successfully' };
  }
}
