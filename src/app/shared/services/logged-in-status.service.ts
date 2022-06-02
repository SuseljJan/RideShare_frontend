import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggedInStatusService {
  isLoggedInEmitter = new EventEmitter<boolean>();

  constructor() { }

}
