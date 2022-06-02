import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserWithReviews} from '../../../shared/models/api-models/user-with-reviews';
import {PaginatedPassengersOffer} from '../../../shared/models/api-models/paginated/paginated-passengers-offer';
import {Transport} from '../../../shared/models/api-models/transport';
import {AlertService} from '../../../shared/services/alert.service';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-my-transport-requests',
  templateUrl: './my-transport-requests.component.html',
  styleUrls: ['./my-transport-requests.component.css'],
  providers: [TranslateService]
})
export class MyTransportRequestsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  transport: Transport;
  passengersOffers: PaginatedPassengersOffer;
  acceptedPassengersOffers: PaginatedPassengersOffer;

  constructor(
    private apiAccess: ApiAccessService,
    private route: ActivatedRoute,
    private router: Router,
    private alerts: AlertService,
    private ts: TranslateService
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      const transportId = params.get('id');

      this.subscriptions.push(
        this.apiAccess.get<Transport>(`/transports/${transportId}/`)
          .subscribe(data => {
            this.transport = data;
          })
      );


      this.route.queryParams.subscribe((queryParams: Params) => {
        const availableRequestsPage = queryParams.availableRequestsPage;
        const acceptedRequestsPage = queryParams.acceptedRequestsPage;

        this.subscriptions.push(
          this.apiAccess.get<PaginatedPassengersOffer>(`/transport_requests/`, true, {
            accepted: false,
            transport_id: transportId,
            page_size: 5,
            page: availableRequestsPage || 1
          })
            .subscribe(data => {
              this.passengersOffers = data;
            })
        );

        this.subscriptions.push(
          this.apiAccess.get<PaginatedPassengersOffer>(`/transport_requests/`, true, {
            accepted: true,
            transport_id: transportId,
            page_size: 5,
            page: acceptedRequestsPage || 1
          })
            .subscribe(data => {
              this.acceptedPassengersOffers = data;
            })
        );
      });
    });
  }

  changeAvailableRequestsPage(pageNumber: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {availableRequestsPage: pageNumber},
      queryParamsHandling: 'merge'
    });
  }

  changeAcceptedRequestsPage(pageNumber: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {acceptedRequestsPage: pageNumber},
      queryParamsHandling: 'merge'
    });
  }

  acceptOffer(offerId: number): void {
    this.subscriptions.push(
      this.apiAccess.put('/transport_requests/accept/', null, true, {transport_request: offerId}).subscribe(data => {
        this.alerts.createdAlert('Transport request accepted. We\' notify the passenger');
        this.ngOnInit();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
