import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {PaginatedAlertMessage} from '../../../shared/models/api-models/paginated/paginated-alert-message';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
// import {Socket} from 'ngx-socket-io';
// import  io from 'socket.io-client';
import { faCoffee, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {AlertMessageMongo} from '../../../shared/models/api-models/alert-message-mongo';
import {PaginatedAlertMessageMongo} from '../../../shared/models/api-models/paginated/paginated-alert-message-mongo';
import {AlertMessageService} from '../../../shared/services/alert-message.service';
@Component({
  selector: 'app-alert-messages',
  templateUrl: './alert-messages.component.html',
  styleUrls: ['./alert-messages.component.css']
})
export class AlertMessagesComponent implements OnInit, OnDestroy {
  faEnvelope = faEnvelope;
  subscriptions: Subscription[] = [];

  alertMessages: PaginatedAlertMessageMongo;
  alertMessagesExtended = true;

  constructor(
    private apiAccess: ApiAccessService,
    private router: Router,
    private route: ActivatedRoute,
    private alertMessageService: AlertMessageService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      const page = params.page;
      this.apiAccess.get<PaginatedAlertMessageMongo>('/api/alert-messages', true, {page: page || 1, pageSize: 5}, null, 'http://localhost:3000').subscribe(result => {
        this.alertMessages = result;

        this.listenForNewMessages();
      });
    });
  }

  alreadyListeningForNewMessages = false;
  listenForNewMessages() {
    if (!this.alreadyListeningForNewMessages) {
      this.alreadyListeningForNewMessages = true;
      this.alertMessageService.on('alert-message', (message) => {
        this.alertMessages.count++;

        this.alertMessages.results.unshift(message);
        this.alertMessages.results = this.alertMessages.results.slice(0, 5);
      });
    }
  }

  archiveMessage(messageId: number): void {
    console.log('archive')

    this.subscriptions.push(
      this.apiAccess.put<boolean>(`/api/alert-messages/${messageId}/archive`, null, true, null, null, 'http://localhost:3000')
        .subscribe(data => {
          // Reload data
          this.ngOnInit();
        })
    );
  }

  changePage(pageNumber: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {page: pageNumber},
      queryParamsHandling: 'merge'
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

    this.apiAccess.put('/api/alert-messages/read', null, true, null, null, 'http://localhost:3000').subscribe(result => {

    });
  }
}
