import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {JsonConvert, OperationMode, ValueCheckingMode} from 'json2typescript';
import {AuthService} from './auth.service';
import {catchError} from 'rxjs/operators';
import {AlertService} from './alert.service';
import {LocalStorageHelpersService} from './local-storage-helpers.service';
import {BaseUris} from '../common/base-uris';
import {Router} from '@angular/router';
import {CommonService} from './common.service';
import {LoggedInStatusService} from './logged-in-status.service';


@Injectable({
  providedIn: 'root'
})
export class ApiAccessService {

  constructor(
    private http: HttpClient,
    private localStorageHelpers: LocalStorageHelpersService,
    private alertService: AlertService,
    private router: Router,
    private common: CommonService,
    private loggedInStatus: LoggedInStatusService,
  ) {
  }

  get defaultBaseUri(): string {
    return BaseUris.DjangoBackend;
  }

  handleError(err: HttpErrorResponse, errorHandlers?: Map<number, (err: HttpErrorResponse) => void>) {
    // Error handler provided from component
    if (errorHandlers && errorHandlers.has(err.status)) {
      errorHandlers.get(err.status)(err);
    } else {
      switch (err.status) {
        case 500: {
          this.alertService.exceptionAlert('There was a problem with the server. Please try again.');
          break;
        }
        case 404: {
          this.alertService.exceptionAlert('Resource was removed. Please contact site administrator.');
          break;
        }
        case 403: {
          this.alertService.exceptionAlert('You do not have permissions to view this resource.');
          break;
        }
        case 401: {
          this.alertService.exceptionAlert('Your authorization token has expired. Please log in again');
          this.localStorageHelpers.removeTokenFromLocalStorage();
          this.loggedInStatus.isLoggedInEmitter.emit(false);
          this.router.navigate(['/login']);
          break;
        }
        case 400: {
          this.alertService.exceptionAlert(this.alertService.convertDjangoExceptionsToString(err.error));
          break;
        }
        default: {
          this.alertService.exceptionAlert('There was an unknown error. Please contact administrator of the site.');
        }
      }

    }

    return throwError(err);
  }

  get<T>(endpoint: string, includeAuthToken = false, queryParams?, errorHandlers?: Map<number, (err: HttpErrorResponse) => void>, baseUri: string= this.defaultBaseUri): Observable<T> {
    return this.http
      .get<T>(baseUri + endpoint, this.createHttpOptions(queryParams, includeAuthToken))
      .pipe(catchError((err) => {
        return this.handleError(err, errorHandlers);
      }));
  }

  post<T>(endpoint: string, model, includeAuthToken = false, queryParams?, errorHandlers?: Map<number, (err: HttpErrorResponse) => void>, baseUri: string= this.defaultBaseUri): Observable<T> {
    return this.http
      .post<T>(baseUri + endpoint, model, this.createHttpOptions(queryParams, includeAuthToken))
      .pipe(catchError((err) => {
        return this.handleError(err, errorHandlers);
      }));
  }

  put<T>(endpoint: string, model, includeAuthToken = false, queryParams?, errorHandlers?: Map<number, (err: HttpErrorResponse) => void>, baseUri: string= this.defaultBaseUri): Observable<T> {
    return this.http
      .put<T>(baseUri + endpoint, model, this.createHttpOptions(queryParams, includeAuthToken))
      .pipe(catchError((err) => {
        return this.handleError(err, errorHandlers);
      }));
  }

  delete<T>(endpoint: string, includeAuthToken = false, queryParams?, errorHandlers?: Map<number, (err: HttpErrorResponse) => void>, baseUri: string= this.defaultBaseUri): Observable<T> {
    return this.http
      .delete<T>(baseUri + endpoint, this.createHttpOptions(queryParams, includeAuthToken))
      .pipe(catchError((err) => {
        return this.handleError(err, errorHandlers);
      }));
  }

  createHttpOptions(queryParams, includeAuthToken) {
    if (!includeAuthToken || (includeAuthToken && !this.localStorageHelpers.readTokenFromLocalStorage())) {
      return {
        params: queryParams
      };
    }


    return {
      headers: new HttpHeaders({
        Authorization: includeAuthToken ? `Token ${this.localStorageHelpers.readTokenFromLocalStorage()}` : null
      }),
      params: queryParams
    };
  }

}
