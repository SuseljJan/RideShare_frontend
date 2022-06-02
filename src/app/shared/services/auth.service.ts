import {EventEmitter, Injectable} from '@angular/core';
import {ApiAccessService} from "./api-access.service";
import {LoginUser} from "../models/api-models/login-user";
import {Token} from "../models/api-models/token";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {RegisterUser} from "../models/api-models/register-user";
import {Router} from "@angular/router";
import * as Endpoints from '../common/endpoints.json';
import {AlertService} from './alert.service';
import {AuthenticatedOnlyDirective} from '../directives/authenticated-only.directive';
import {Observable} from 'rxjs';
import {LocalStorageHelpersService} from './local-storage-helpers.service';
import {LoggedInStatusService} from './logged-in-status.service';
import {UserDetails} from '../models/api-models/user-details';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private alerts: AlertService,
    private apiAccess: ApiAccessService,
    private localStorageHelpers: LocalStorageHelpersService,
    private loggedInStatus: LoggedInStatusService,
  ) {
  }

  // isLoggedInEmitter = new EventEmitter<boolean>();




  public isAuthenticated(): boolean {
    return this.localStorageHelpers.readTokenFromLocalStorage() != null && this.localStorageHelpers.readTokenFromLocalStorage() !== undefined;
  }


  login(userCredentials: LoginUser) {
    let token: Token;
    this.apiAccess.post<Token>(
      '/auth/login/',
      userCredentials,
      false,
      null,
      new Map([[400, (err) => this.alerts.exceptionAlert('Invalid username or password')]]))
      .subscribe(data => {
        token = data;
      },
      (err) => {},
      () => {
        this.localStorageHelpers.writeTokenToLocalStorage(token.key);
        if (token != null) {
          this.loggedInStatus.isLoggedInEmitter.emit(true);
          this.apiAccess.get<UserDetails>('/user_details/', true).subscribe(result => {
            this.localStorageHelpers.writeUsernameToLocalStorage(result.username);
            this.router.navigate(['/me/profile']);
            this.alerts.loginAlert();
          });
        }

      });


  }

  logout() {
    this.apiAccess.post('/auth/logout/', null, true).subscribe(data => {
      this.loggedInStatus.isLoggedInEmitter.emit(false);
      this.localStorageHelpers.removeTokenFromLocalStorage();
      this.localStorageHelpers.removeUsernameFromLocalStorage();
      this.router.navigate(['/']);
      this.alerts.logoutAlert();
    });
  }

  register(userCredentials: RegisterUser) {
    let token: Token;
    this.apiAccess.post<Token>(
      '/auth/register/',
      userCredentials,
      )
      .subscribe(data => {
        token = data;
      }, (err) => {},
        () => {
        this.localStorageHelpers.writeTokenToLocalStorage(token.key);
        this.router.navigate(['/me/profile']);
        this.alerts.registerAlert();
        this.loggedInStatus.isLoggedInEmitter.emit(true);
      });
  }



}
