import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';
import {AlertMessageService} from '../../services/alert-message.service';
import {MatSnackBar} from '@angular/material';
import {LeafletLocationPickerComponent} from '../leaflet-location-picker/leaflet-location-picker.component';
import {NotificationsDropdownComponent} from '../notifications-dropdown/notifications-dropdown.component';
import {AlertMessageMongo} from '../../models/api-models/alert-message-mongo';
import {LocalStorageHelpersService} from '../../services/local-storage-helpers.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
  providers: [MatSnackBar]
})
export class MainNavComponent implements OnInit, OnDestroy {

  userMenuVisible = false;
  numberOfNotifications = 0;
  notificationCounterHidden = true;
  latestNotifications: AlertMessageMongo[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
    .pipe(
      map(result => result.matches ),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AuthService,
    private alertMessageService: AlertMessageService,
    private snackBar: MatSnackBar,
    private localStorageHelpers: LocalStorageHelpersService,
    ) {}

  logout() {
    this.auth.logout();
  }

  ngOnInit(): void {
    this.alertMessageService.connect();
    this.alertMessageService.on('unread-messages', (messages) => {

      this.numberOfNotifications = messages.unreadMessages.length;
      this.notificationCounterHidden = messages.unreadMessages.length === 0;
      this.latestNotifications = messages.unreadMessages.slice(0, 3);
    });

    this.alertMessageService.on('alert-message', (message) => {
      this.numberOfNotifications++;
      this.notificationCounterHidden = false;
      this.showNewMessageSnackbar(message.title);

      let previous = []

      if (this.latestNotifications.length < 3) {
        previous = this.latestNotifications;
      } else {
        previous = this.latestNotifications.slice(1, 3);
      }
      previous.unshift(message);
      this.latestNotifications = previous;
      console.log(this.latestNotifications);
    });

    this.alertMessageService.on('all-read', (body) => {
      console.log('all read triggered');

      this.numberOfNotifications = 0;
      this.notificationCounterHidden = true;
      this.latestNotifications = [];

    });



    // this.socket.on('disconnect', () => {console.log('disconnected')});
    // this.socket.disconnect()

    // this.subscriptions.push(
    //   this.apiAccess.get<PaginatedAlertMessage>('/alert_messages/', true)
    //     .subscribe(data => {
    //       this.alertMessages = data;
    //     })
    // );
    this.setUsername();
  }

  ngOnDestroy(): void {
    this.alertMessageService.disconnect();
  }

  showNewMessageSnackbar(message: string) {
    this.snackBar.open(
      message,
      'dismiss',
      {duration: 2000, verticalPosition: 'top'}
    );
  }

  // notificationsOpened = false;
  //
  // hoverOverWarningIcon(show: boolean) {
  //
  //   this.notificationsOpened = show;
  // }

  @ViewChild(NotificationsDropdownComponent, {static: false}) notificationsDropdown: NotificationsDropdownComponent;
  showNotifications() {
    if (!this.notificationsDropdown.notificationsShown) {
      this.notificationsDropdown.openNotifications();
    } else {
    this.notificationsDropdown.closeNotifications();
    }
  }

  onDismissAll() {
    this.numberOfNotifications = 0;
    this.notificationCounterHidden = true;
    this.latestNotifications = [];
  }

  username = "";
  setUsername() {
    this.username = this.localStorageHelpers.readUsernameFromLocalStorage();
  }

}
