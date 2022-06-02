import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {Transport} from '../../../shared/models/api-models/transport';
import {TakenTransport} from '../../../shared/models/api-models/taken-transport';
import {PaginatedGivenTransports} from '../../../shared/models/api-models/paginated/paginated-given-transports';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PaginatedTakenTransports} from '../../../shared/models/api-models/paginated/paginated-taken-transports';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {AlertService} from '../../../shared/services/alert.service';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-my-transports',
  templateUrl: './my-transports.component.html',
  styleUrls: ['./my-transports.component.css']
})
export class MyTransportsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  givenTransports: PaginatedGivenTransports;
  takenTransports: PaginatedTakenTransports;

  givenTransportsExpand = true;
  takenTransportsExpand = true;

  constructor(
    private apiAccess: ApiAccessService,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private alerts: AlertService,
    private ts: TranslateService,
  ) {
  }

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.givenTransportsExpand = false;
          this.takenTransportsExpand = false;
        }
      });

    this.route.queryParams.subscribe((params: Params) => {
      const givenPage = params.givenPage;
      const takenPage = params.takenPage;

      this.subscriptions.push(
        this.apiAccess.get<PaginatedGivenTransports>('/transports/given/', true, {page_size: 5, page: givenPage || 1})
          .subscribe(data => {
            this.givenTransports = data;
          })
      );

      this.subscriptions.push(
        this.apiAccess.get<PaginatedTakenTransports>('/transport_requests/my/active/', true, {page_size: 5, page: takenPage || 1})
          .subscribe(data => {
            this.takenTransports = data;
          })
      );
    });
  }

  changeGivenTransportPage(pageNumber) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {givenPage: pageNumber},
      queryParamsHandling: 'merge'
    });
  }

  changeTakenTransportPage(pageNumber) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {takenPage: pageNumber},
      queryParamsHandling: 'merge'
    });
  }

  cancelTransport(transportId) {
    this.alerts.confirmationPrompt(
      'Are you sure?',
      'Transport offer will be removed from search',
      result => {
        if (result.value) {
          this.apiAccess.put(`/transports/cancel/${transportId}/`, null, true).subscribe(data => {
            this.ngOnInit();
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
