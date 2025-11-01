import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addToCart(
    @GetUser('userId') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Get()
  getCart(@GetUser('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Patch(':itemId')
  updateCartItem(
    @GetUser('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(userId, itemId, updateCartItemDto);
  }

  @Delete(':itemId')
  removeFromCart(
    @GetUser('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeFromCart(userId, itemId);
  }

  @Delete()
  clearCart(@GetUser('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
