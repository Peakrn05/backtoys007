import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@Req() req: any) {
    const userId = req.user.sub;
    return this.usersService.findMe(userId);
  }

  @Put('me')
  @UseGuards(JwtGuard)
  updateMe(@Req() req: any, @Body() body: any) {
    const userId = req.user.sub;
    return this.usersService.updateMe(userId, body);
  }

  @Get('me/orders')
  @UseGuards(JwtGuard)
  getOrders(@Req() req: any) {
    const userId = req.user.sub;
    return this.usersService.getOrders(userId);
  }

  @Get('me/wishlist')
  @UseGuards(JwtGuard)
  getWishlist(@Req() req: any) {
    const userId = req.user.sub;
    return this.usersService.getWishlist(userId);
  }
}
