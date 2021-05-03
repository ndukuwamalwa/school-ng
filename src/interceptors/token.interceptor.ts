import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from 'src/services/session.service';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private sessionService: SessionService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let bearer: string;
    const token = this.sessionService.getToken() as string;
    if (this.pathIs(request, /login\(username:/ig)) {
      // When loging in
      bearer = 'LOGIN';
    } else if (this.pathIs(request, /changePassword\(username:/ig)) {
      bearer = 'PASSWORD_CHANGE';
    } else if (this.pathIs(request, /resetPassword\(email:/ig)) {
      bearer = 'PASSWORD_RESET';
    } else {
      bearer = token;
    }
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${bearer}`
      }
    });

    return next.handle(request).pipe(map(event => {
      return event as any;
    }), catchError((error, caught) => {
      const exceptions = ['LOGIN', 'PASSWORD_CHANGE', 'PASSWORD_RESET'];

      if (error.status === 401 && !exceptions.includes(bearer)) {
        this.sessionService.logout();
      }
      throw error;
    }));
  }

  private pathIs(request: HttpRequest<unknown>, re: RegExp): boolean {
    const body: { operationName: string, query: string } = request.body as any;
    if (!body.query || !body.operationName) {
      return false;
    }
    if (!re.test(body.query)) {
      return false;
    }
    if (body.operationName.toLowerCase() !== 'm') {
      return false;
    }

    return true;
  }
}
