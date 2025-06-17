import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequest } from 'src/models/requests/auth/models';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(registerRequest: RegisterRequest) {
        const { email, password } = registerRequest;

        const existingUser = await this.usersService.findOne(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.usersService.create({
            email: email,
            password: hashedPassword,
        });

        const payload = { email: user.email, userId: user._id }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async login(user: any) {
        const payload = { email: user.email, userId: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
