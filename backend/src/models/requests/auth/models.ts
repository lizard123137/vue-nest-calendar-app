export interface AuthRequest extends Request {
    user: {
        userId: string;
        email: string;
    };
}

export class RegisterRequest {
    readonly email: string;
    readonly password: string;
}