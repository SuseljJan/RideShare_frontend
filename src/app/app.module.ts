import { BrowserModule } from '@angular/platform-browser';
import {Injectable, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SearchTransportsComponent } from './core/components/search-transports/search-transports.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertMessagesComponent } from './core/components/alert-messages/alert-messages.component';
import { MyTransportsComponent } from './core/components/my-transports/my-transports.component';
import { MyProfileComponent } from './core/components/my-profile/my-profile.component';
import { MyCampaignsComponent } from './core/components/my-campaigns/my-campaigns.component';
import { ReviewsComponent } from './core/components/reviews/reviews.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MainNavComponent } from './shared/components/main-nav/main-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  MatBadgeModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule, MatSelectModule, MatSlideToggleModule, MatSnackBar, MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import { AuthenticatedOnlyDirective } from './shared/directives/authenticated-only.directive';
import { NonAuthenticatedOnlyDirective } from './shared/directives/non-authenticated-only.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyTransportRequestsComponent } from './core/components/my-transport-requests/my-transport-requests.component';
import { CreateTransportComponent } from './core/components/create-transport/create-transport.component';
import { ContextMenuComponent, ContextMenuModule } from 'ngx-contextmenu';
import { GoogleMapsLocationPickerComponent } from './shared/components/google-maps-location-picker/google-maps-location-picker.component';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { LeafletLocationPickerComponent } from './shared/components/leaflet-location-picker/leaflet-location-picker.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LocationComponent } from './shared/components/location/location.component';
import { DisplayLocationComponent } from './shared/components/display-location/display-location.component';
import { ButtonsModule, InputsModule, MDBBootstrapModule, TooltipModule, WavesModule } from 'angular-bootstrap-md';
import { RatingModule } from 'ng-starrating';
import { ResponsiveTableWithCollapsedRowsTwoSideComponent } from './shared/components/responsive-table-with-collapsed-rows-two-side/responsive-table-with-collapsed-rows-two-side.component';
import { TestdirectDirective } from './shared/directives/testdirect.directive';
import { ResponsiveTableWithCollapsedRowsLeftComponent } from './shared/components/responsive-table-with-collapsed-rows-left/responsive-table-with-collapsed-rows-left.component';
import { DisplayLocationsFormComponent } from './shared/components/display-locations-form/display-locations-form.component';
import { DisplayDateAndTimeFormComponent } from './shared/components/display-date-and-time-form/display-date-and-time-form.component';
import { DisplayPriceAndSeatsFormComponent } from './shared/components/display-price-and-seats-form/display-price-and-seats-form.component';
import { SubmitBtnComponent } from './shared/components/buttons/submit-btn/submit-btn.component';
import { ActionBtnComponent } from './shared/components/buttons/action-btn/action-btn.component';
import { MyLocationsComponent } from './core/components/my-locations/my-locations.component';
import {IgxInputGroupModule, IgxTimePickerModule} from 'igniteui-angular';
import {DatePipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { HomeComponent } from './core/components/home/home.component';
import { RequestsOfCampaignComponent } from './core/components/requests-of-campaign/requests-of-campaign.component';
import { ShowErrorsComponent } from './shared/components/show-errors/show-errors.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { LocationsOftenUsedMapManualComboComponent } from './shared/components/locations-often-used-map-manual-combo/locations-often-used-map-manual-combo.component';
import { CreateTransportRequestComponent } from './core/components/create-transport-request/create-transport-request.component';
import { DisplayTransportOfferDetailsComponent } from './shared/components/display-transport-offer-details/display-transport-offer-details.component';
import { ColorLegendComponent } from './shared/components/color-legend/color-legend.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MinValidatorDirective } from './shared/directives/min-validator.directive';
import { MaxValidatorDirective } from './shared/directives/max-validator.directive';
import { GeneralHelpComponent } from './core/components/general-help/general-help.component';
import { DriversHelpComponent } from './core/components/drivers-help/drivers-help.component';
import { PassengersHelpComponent } from './core/components/passengers-help/passengers-help.component';
import {SocketIoModule, SocketIoConfig, Socket} from 'ngx-socket-io';
import {LocalStorageHelpersService} from './shared/services/local-storage-helpers.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {AlertMessageService} from './shared/services/alert-message.service';
import { NotificationsDropdownComponent } from './shared/components/notifications-dropdown/notifications-dropdown.component';
import { NgxPopper } from 'angular-popper';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}




@NgModule({
  declarations: [
    AppComponent,
    SearchTransportsComponent,
    LoginComponent,
    RegisterComponent,
    AlertMessagesComponent,
    MyTransportsComponent,
    MyProfileComponent,
    MyCampaignsComponent,
    ReviewsComponent,
    MainNavComponent,
    MainNavComponent,
    AuthenticatedOnlyDirective,
    NonAuthenticatedOnlyDirective,
    MyTransportRequestsComponent,
    CreateTransportComponent,
    GoogleMapsLocationPickerComponent,
    LeafletLocationPickerComponent,
    LocationComponent,
    DisplayLocationComponent,
    ResponsiveTableWithCollapsedRowsTwoSideComponent,
    TestdirectDirective,
    ResponsiveTableWithCollapsedRowsLeftComponent,
    DisplayLocationsFormComponent,
    DisplayDateAndTimeFormComponent,
    DisplayPriceAndSeatsFormComponent,
    ActionBtnComponent,
    SubmitBtnComponent,
    MyLocationsComponent,
    HomeComponent,
    RequestsOfCampaignComponent,
    ShowErrorsComponent,
    LocationsOftenUsedMapManualComboComponent,
    CreateTransportRequestComponent,
    DisplayTransportOfferDetailsComponent,
    ColorLegendComponent,
    FooterComponent,
    MinValidatorDirective,
    MaxValidatorDirective,
    GeneralHelpComponent,
    DriversHelpComponent,
    PassengersHelpComponent,
    NotificationsDropdownComponent

  ],
  imports: [
    NgbModule,
    MatSnackBarModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    NgxPopper,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatFormFieldModule,
    MatFormFieldModule,
    NgxPaginationModule,
    MatTooltipModule,
    LayoutModule,
    MatPaginatorModule,
    ContextMenuModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.agmKey
    }),
    LeafletModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    RatingModule,
    MatInputModule,
    ReactiveFormsModule,
    IgxTimePickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    IgxInputGroupModule,
    NgxMaterialTimepickerModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FontAwesomeModule,
    MatBadgeModule,
    // SocketIoModule.forRoot(config)
  ],
  bootstrap: [AppComponent],
  exports: [
    AuthenticatedOnlyDirective,
  ],
   providers: [AlertMessageService]
})
export class AppModule {
}
