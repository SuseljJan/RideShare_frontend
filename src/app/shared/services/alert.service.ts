import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';
import {TranslateService} from '@ngx-translate/core';
import {error} from 'util';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private translate: TranslateService
  ) {
  }

  loginAlert() {
    Swal.fire({
      position: 'top-end',
      toast: true,
      icon: 'success',
      title: this.translate.instant('alert.loggedIn'),
      showConfirmButton: false,
      timer: 1500,
      heightAuto: true
    });
  }

  registerAlert() {
    Swal.fire({
      position: 'top-end',
      toast: true,
      icon: 'success',
      title: this.translate.instant('alert.registered'),
      showConfirmButton: false,
      timer: 1500,
      heightAuto: true
    });
  }

  logoutAlert() {
    Swal.fire({
      position: 'top-end',
      toast: true,
      icon: 'success',
      title: 'Logged out successfully',
      showConfirmButton: false,
      timer: 1500,
      heightAuto: true
    });
  }

  transportCreatedAlert() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Transport created',
      showConfirmButton: false,
      timer: 1000
    });
  }

  offerSentAlert() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Offer was sent',
      showConfirmButton: false,
      timer: 1000
    });
  }

  campaignCreatedAlert() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Campaign was created',
      showConfirmButton: false,
      timer: 1000
    });
  }

  createdAlert(message) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 4000
    });
  }

  exceptionAlert(message) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: message,
      showConfirmButton: true,
    });
  }

  confirmationPrompt(title: string, message: string, callback: (result) => void) {
    Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(callback);
  }

  convertDjangoExceptionsToString(djangoAlert): string {
    try {
      let errorMessage = '';

      for (let key in djangoAlert) {
        let messages = '';
        for (let message in djangoAlert[key]){
          messages += message + "";
        }

        errorMessage += `${key}: ${djangoAlert[key]}\n`;
      }
      return errorMessage;
    } catch (Exception) {
      return 'Unknown exception';
    }
  }
}
