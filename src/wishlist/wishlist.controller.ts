import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.wishlistService.findByUser(userId);
  }

  @Post('toggle')
  toggle(@Body() body: { userId: string; productId: string }) {
    return this.wishlistService.toggle(body);
  }
}
