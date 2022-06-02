import { Injectable } from '@angular/core';
import {LocalStorageHelpersService} from './local-storage-helpers.service';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

 /* constructor(
    private localStorageHelpers: LocalStorageHelpersService,
    private auth: AuthService,
  ) { }

  logoutWithoutAlertsAndRedirects() {
    this.localStorageHelpers.removeTokenFromLocalStorage();
    this.auth.isLoggedInEmitter.emit(false);*/
  // }
}
