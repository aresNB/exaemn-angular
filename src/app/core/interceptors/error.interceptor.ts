import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      const message = err.error?.message || 'Une erreur est survenue';
      console.error('[BadWallet Error]', message);
      return throwError(() => new Error(message));
    })
  );
};