import {NgModule} from '@angular/core';
import {Routes, RouterModule, UrlSegment, UrlSegmentGroup, Route, UrlMatchResult} from '@angular/router';
import {SearchTransportsComponent} from './core/components/search-transports/search-transports.component';
import {LoginComponent} from './core/components/login/login.component';
import {RegisterComponent} from './core/components/register/register.component';
import {ReviewsComponent} from './core/components/reviews/reviews.component';
import {MyProfileComponent} from './core/components/my-profile/my-profile.component';
import {MyCampaignsComponent} from './core/components/my-campaigns/my-campaigns.component';
import {MyTransportsComponent} from './core/components/my-transports/my-transports.component';
import {AlertMessagesComponent} from './core/components/alert-messages/alert-messages.component';
import {MyTransportRequestsComponent} from './core/components/my-transport-requests/my-transport-requests.component';
import {CreateTransportComponent} from './core/components/create-transport/create-transport.component';
import {MyLocationsComponent} from './core/components/my-locations/my-locations.component';
import {HomeComponent} from './core/components/home/home.component';
import {RequestsOfCampaignComponent} from './core/components/requests-of-campaign/requests-of-campaign.component';
import {CreateTransportRequestComponent} from './core/components/create-transport-request/create-transport-request.component';
import {GeneralHelpComponent} from './core/components/general-help/general-help.component';
import {DriversHelpComponent} from './core/components/drivers-help/drivers-help.component';
import {PassengersHelpComponent} from './core/components/passengers-help/passengers-help.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'reviews/:id', component: ReviewsComponent},
  {path: 'transports', children: [
      {path: 'search', component: SearchTransportsComponent},
      {path: 'create', component: CreateTransportComponent},
      {path: ':id/send_request', component: CreateTransportRequestComponent},
    ]},
  {
    path: 'me', children: [
      {path: 'campaigns', children: [
          {path: 'requests/:id', component: RequestsOfCampaignComponent},
          {path: '', component: MyCampaignsComponent}
        ]},
      {path: 'transports', component: MyTransportsComponent},
      {path: 'profile', component: MyProfileComponent},
      {path: 'messages', component: AlertMessagesComponent},
      {
        path: 'transport/:id', children: [
          {path: 'requests', component: MyTransportRequestsComponent},
        ]
      },
      {path: 'locations', component: MyLocationsComponent},
    ]
  },
  {path: 'help', children: [
      // {path: 'campaigns', component: MyProfileComponent},
      {path: 'passengers', component: PassengersHelpComponent},
      {path: 'drivers', component: DriversHelpComponent},
      {path: '', component: GeneralHelpComponent},
    ]},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
