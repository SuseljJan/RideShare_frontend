import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AlertMessageMongo} from '../../models/api-models/alert-message-mongo';
import {ApiAccessService} from '../../services/api-access.service';

@Component({
  selector: 'app-notifications-dropdown',
  templateUrl: './notifications-dropdown.component.html',
  styleUrls: ['./notifications-dropdown.component.css']
})
export class NotificationsDropdownComponent implements OnInit {
  notificationsShown = false;

  @Input() notifications: AlertMessageMongo[] = [];
  @Input() notificationsCount = 0;

  @Output() dismissAllEvent = new EventEmitter<void>();
  //
  // notificationHovered = false;
  // justLeft = null;


  // @Input()
  // set hoverOverNotification(val: boolean){
  //   this.notificationHovered = val;
  //   console.log('hover', val);
  //   console.log('notif', this.notificationsOpened)
  //   if (!val ){
  //     this.justLeft = new Date();
  //   }
  // }

  // notificationsOpened = false;
  // latestMessages: AlertMessageMongo[] = [];

  constructor(
    private apiAccess: ApiAccessService,
  ) { }

  ngOnInit() {
  }

  dismissAll() {
    this.apiAccess.put('/api/alert-messages/read', null, true, null, null, 'http://localhost:3000').subscribe(result => {
      this.notifications = [];
      this.dismissAllEvent.emit();
    });
  }

  openNotifications() {
    this.notificationsShown = true;
    // console.log({'a': this.notificationHovered, 'b': this.notificationsOpened, 'c': this.justLeft});
    //
    //
    // this.notificationsOpened = true;
  }

  closeNotifications() {
    // console.log('close')
    this.notificationsShown = false;
  }

  // justLeftIsWithin100Miliseconds() {
  //   if (this.justLeft) {
  //     let hundredMIlsBefore = new Date(this.justLeft);
  //     let hundredMIlsAfter = new Date(this.justLeft);
  //     hundredMIlsAfter.setSeconds(this.justLeft.getSeconds() - 1);
  //     hundredMIlsAfter.setSeconds(this.justLeft.getSeconds() + 1);
  //
  //     const shouldDisplay = this.justLeft > hundredMIlsBefore && this.justLeft < hundredMIlsAfter
  //
  //     console.log('s', shouldDisplay)
  //     return shouldDisplay;
  //   } else {
  //     return false;
  //   }
  // }
}
