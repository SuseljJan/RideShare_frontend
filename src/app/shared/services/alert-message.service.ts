import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {LocalStorageHelpersService} from './local-storage-helpers.service';

@Injectable({
  providedIn: 'root'
})
export class AlertMessageService extends Socket {

  constructor(
    private localStorageHelper: LocalStorageHelpersService
  ) {
    super({url: `http://localhost:4000?token=${localStorageHelper.readTokenFromLocalStorage()}`, options: {}});
  }
}
