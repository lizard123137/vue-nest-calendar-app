import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterRequest } from 'src/models/requests/auth/models';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('auth/register')
    async register(@Body() registerRequest: RegisterRequest) {
        return this.authService.register(registerRequest);
    }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(LocalAuthGuard)
    @Post('auth/logout')
    async logout(@Request() req) {
        return req.logout();
    }


    @UseGuards(JwtAuthGuard)
    @Get('auth/profile')
    async getProfile(@Request() req) {
        return req.user;
    }
}
