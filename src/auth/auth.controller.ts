import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'JWT ile korumalı örnek endpoint' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 201 })
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200 })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }
}
