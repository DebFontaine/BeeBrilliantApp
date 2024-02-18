import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toaster: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error){
          switch(error.status)
          {
            case 400:
              if(error.error?.errors){
                const modelStateErrors = [];
                for(const key in error.error.errors){
                  if(error.error.errors[key]){
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modelStateErrors.flat();
              }
              else{
                this.displayError(error.error, error.status.toString());
              }
              break;
            case 401:
              this.displayError("Unauthorized", error.status.toString());
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.displayError("Something unexpected happened","");
              console.log(error);
              break;
          }
        }
        throw error;
      })
    )
  }

  displayError(error: string, action: string)
  {
    this.toaster.open(error,action,{
      duration: 3 * 1000
    });
  }
}
