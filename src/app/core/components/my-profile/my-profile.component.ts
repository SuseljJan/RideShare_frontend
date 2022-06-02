import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {PaginatedReview} from '../../../shared/models/api-models/paginated/paginated-review';
import {UserShort} from '../../../shared/models/api-models/user-short';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  providers: [TranslateService]
})
export class MyProfileComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  profileDetailsExpand = true;
  myReviewsExpand = true;
  reviews: PaginatedReview;
  me: UserShort;

  constructor(
    private apiAccess: ApiAccessService,
    private ts: TranslateService
  ) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.apiAccess.get<PaginatedReview>('/reviews/mine/', true).subscribe(data => {
        this.reviews = data;
      })
    );

    this.subscriptions.push(
      this.apiAccess.get<UserShort>('/users/about_me', true).subscribe(data => {
        this.me = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
