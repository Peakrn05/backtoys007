import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Headers,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Headers('x-user-id') userId?: string) {
    return this.cartService.getCart(userId);
  }

  @Post()
  addItem(
    @Body()
    body: {
      productId: string;
      quantity: number;
      userId: string;
    },
  ) {
    return this.cartService.addItem(body);
  }

  @Put('item')
  updateItem(
    @Body() body: { userId: string; productId: string; quantity: number },
  ) {
    return this.cartService.updateItem(body.userId, body.productId, body.quantity);
  }

  @Delete('item')
  removeItem(@Body() body: { userId: string; productId: string }) {
    return this.cartService.removeItem(body.userId, body.productId);
  }

  @Delete()
  clearCart(@Body() body: { userId: string }) {
    return this.cartService.clearCart(body.userId);
  }
}
