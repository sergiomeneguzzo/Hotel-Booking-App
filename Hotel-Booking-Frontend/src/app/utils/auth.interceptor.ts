import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private jwtSrv: JwtService) {}

  //abilita cloudinary a fare richieste senza token
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.includes('https://api.cloudinary.com/v1_1')) {
      return next.handle(req);
    }

    const authToken = this.jwtSrv.getToken();

    const authReq = authToken
      ? req.clone({
          headers: req.headers.set('Authorization', `Bearer ${authToken}`),
        })
      : req;

    return next.handle(authReq);
  }
}
