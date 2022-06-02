import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageHelpersService {

  constructor() { }

  writeUsernameToLocalStorage(username: string) {
    localStorage.setItem('currentUserUsername', JSON.stringify(username));
  }

  readUsernameFromLocalStorage() {
    return JSON.parse(localStorage.getItem('currentUserUsername'));
  }

  removeUsernameFromLocalStorage() {
    localStorage.removeItem('currentUserUsername');
  }

  writeTokenToLocalStorage(token) {
    localStorage.setItem('currentUser', JSON.stringify(token));
  }

  readTokenFromLocalStorage() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  removeTokenFromLocalStorage() {
    localStorage.removeItem('currentUser');
  }
}
