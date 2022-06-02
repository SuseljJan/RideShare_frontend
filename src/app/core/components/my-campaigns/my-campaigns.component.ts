import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {Campaign} from '../../../shared/models/api-models/campaign';
import {CampaignPost} from '../../../shared/models/api-models/campaign-post';
import {PaginatedCampaign} from '../../../shared/models/api-models/paginated/paginated-campaign';
import {AlertService} from '../../../shared/services/alert.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-my-campaigns',
  templateUrl: './my-campaigns.component.html',
  styleUrls: ['./my-campaigns.component.css'], providers: [TranslatePipe]
})
export class MyCampaignsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  campaigns: PaginatedCampaign;
  newCampaign: CampaignPost = new CampaignPost('');
  campaignsExpanded = true;
  createCampaignExpanded = true;

  constructor(
    private ts: TranslateService,
    private translate: TranslatePipe,
    private apiAccess: ApiAccessService,
    private alert: AlertService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      const page = params.page;

      this.subscriptions.push(
        this.apiAccess.get<PaginatedCampaign>('/campaigns/all/', true, {page: page || 1})
          .subscribe(data => {
            this.campaigns = data;
          })
      );
    });
  }

  createCampaign() {
    this.subscriptions.push(
      this.apiAccess.post<Campaign>('/campaigns/all/', this.newCampaign, true)
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
  }

}
