import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog:MatDialog){}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error:HttpErrorResponse)=>{
        let errMessege = "An Unknown error!!";
        if(error.error.messege){
          errMessege = error.error.messege;
        }
        this.dialog.open(ErrorComponent,{data:{messege:errMessege}});
        return throwError(error);

      })
    );
  }
}
