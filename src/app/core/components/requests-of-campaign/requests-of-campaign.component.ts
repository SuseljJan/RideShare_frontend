import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginatedTakenTransports} from '../../../shared/models/api-models/paginated/paginated-taken-transports';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Campaign} from '../../../shared/models/api-models/campaign';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-requests-of-campaign',
  templateUrl: './requests-of-campaign.component.html',
  styleUrls: ['./requests-of-campaign.component.css']
})
export class RequestsOfCampaignComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  requestsOfCampaignExpanded = true;
  requestsOfCampaign: PaginatedTakenTransports;
  campaign: Campaign;


  constructor(
    private apiAccess: ApiAccessService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      const campaignId = params.get('id');

      this.subscriptions.push(
        this.apiAccess.get<Campaign>(`/campaigns/all/${campaignId}/`, true).subscribe(result => {
          this.campaign = result;
        })
      );

      this.route.queryParams.subscribe((queryParams: Params) => {
        const page = queryParams.page;

        this.subscriptions.push(
          this.apiAccess.get<PaginatedTakenTransports>('/transport_requests/of_campaign/', true,
            {campaign_id: campaignId, page_size: 5, page: page || 1}).subscribe(data => {
            this.requestsOfCampaign = data;
          })
        );
      });
    });
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
  }

}
