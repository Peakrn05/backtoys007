import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtGuard)
  findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.ordersService.findAll(userId);
  }

  @Post()
  @UseGuards(JwtGuard)
  create(
    @Req() req: any,
    @Body()
    body: {
      items: { productId: string; quantity: number }[];
      paymentMethod?: string;
    },
  ) {
    const userId = req.user.sub;
    return this.ordersService.create(userId, body);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
