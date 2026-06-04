import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Body()
    body: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @Post('social')
  social(
    @Body()
    body: {
      provider: string;
      providerId: string;
      firstName: string;
      lastName: string;
      email: string;
    },
  ) {
    return this.authService.social(body);
  }

  @Post('guest')
  guest() {
    return this.authService.guest();
  }
}
