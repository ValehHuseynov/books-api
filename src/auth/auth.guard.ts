import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWTPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  // Injecting necessary services: JwtService for token, ConfigService for retrieving JWT secret
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieving the request object from the execution context
    const request: Request = context.switchToHttp().getRequest();

    // Extracting the authorization header which contains the JWT token
    const { authorization } = request.headers;
    const token = authorization?.split(' ')[1]; // Extracting token from the authorization header

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      // Verifying the token using the JWT secret
      const payload = await this.jwtService.verifyAsync<JWTPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      // Assigning the user payload to the 'user' property of the request object
      request['user'] = payload;
    } catch (error) {
      // If token verification fails throw an UnauthorizedException
      throw new UnauthorizedException();
    }

    // If token verification is successful, return true to grant access
    return true;
  }
}
