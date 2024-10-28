import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
            const request = context.switchToHttp().getRequest();
            const { authorization }: any = request.headers;

            if (!authorization || authorization.trim() === '') {
                throw new UnauthorizedException('Please provide token');
            }

            const authToken = authorization.replace(/bearer/gim, '').trim();
            const user = await this.authService.validateToken(authToken);
            request.decodedData = user;

            if (roles && !roles.includes(user.role)) {
                throw new ForbiddenException('Access denied: You do not have the required permissions');
            }

            return true;
        } catch (error) {
            console.log('auth error - ', error.message);
            throw new UnauthorizedException(error.message || 'Invalid token or session expired! Please sign in');
        }
    }
}
