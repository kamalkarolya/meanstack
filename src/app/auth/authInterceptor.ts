import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { authService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authservice:authService ){}
    intercept(req: HttpRequest<any>, next: HttpHandler){
      const authToken = this.authservice.getToken();
      const authRequest = req.clone({
        headers:req.headers.set("Authorization","Bearer "+authToken)
      });
      return next.handle(authRequest);
    }
}
