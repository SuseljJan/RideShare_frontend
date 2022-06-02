import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {UserWithReviews} from '../../../shared/models/api-models/user-with-reviews';
import {Review} from '../../../shared/models/api-models/review';
import {ReviewPost} from '../../../shared/models/api-models/review-post';
import {AuthService} from '../../../shared/services/auth.service';
import {UserShort} from '../../../shared/models/api-models/user-short';
import {PaginatedReview} from '../../../shared/models/api-models/paginated/paginated-review';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  paginatedReview: PaginatedReview;
  userWithAvgRatings: UserShort & { avgRating: number, numberOfRatings: number };

  reviewToPost: ReviewPost = new ReviewPost(1, '', null);

  latestReviewsExpanded = true;
  createReviewExpanded = false;

  constructor(
    private apiAccess: ApiAccessService,
    private route: ActivatedRoute,
    readonly auth: AuthService,
    private router: Router,
    private ts: TranslateService,
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      const reviewedId = params.get('id');
      this.reviewToPost.reviewed = reviewedId;

      this.subscriptions.push(
        this.apiAccess.get<UserShort & { avgRating: number, numberOfRatings: number }>(`/users/${reviewedId}/`).subscribe(result => {
          this.userWithAvgRatings = result;
        })
      );


      this.route.queryParams.subscribe((qParams: Params) => {
        const page = qParams.page;

        this.subscriptions.push(
          this.apiAccess.get<PaginatedReview>(`/users/${reviewedId}/latest_reviews/`, false, {
            page_size: 5,
            page: page || 1
          }).subscribe(result => {
            this.paginatedReview = result;
          })
        );

      });
    });


  }


  postAReview() {
    this.subscriptions.push(
      this.apiAccess.post<any>('/reviews/create/', this.reviewToPost, true)
        .subscribe(data => {
          this.reviewToPost = new ReviewPost(1, '', null);
          this.ngOnInit();

          this.createReviewExpanded = false;
          this.latestReviewsExpanded = true;
        })
    );
  }

  changeLatestReviewsPage(pageNumber: number) {
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
