import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/auth/login')
  async login(@Request() req) {
    return this.authService.login(req.body)
  }

  @Get('/auth/profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Request() req){
    return req.user
  }
}
