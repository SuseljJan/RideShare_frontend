import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';
import {LocationCoordinates} from '../../../shared/models/angular-models/location-coordinates';
import {TransportPost} from '../../../shared/models/api-models/transport-post';
import {Location} from '../../../shared/models/api-models/location';
import {TransportForSearch} from '../../../shared/models/angular-models/transport-for-search';
import {PaginatedTransport} from '../../../shared/models/api-models/paginated/paginated-transport';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GeolocationService} from '../../../shared/services/geolocation.service';
import {Coordinates} from '../../../shared/models/angular-models/coordinates';
import {Address} from '../../../shared/models/angular-models/address';
import * as Endpoints from '../../../shared/common/endpoints.json';
import {DatePipe} from '@angular/common';
import {FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {AlertService} from '../../../shared/services/alert.service';
import {LocationsOftenUsedMapManualComboComponent} from '../../../shared/components/locations-often-used-map-manual-combo/locations-often-used-map-manual-combo.component';
import {Subscription} from 'rxjs';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {TranslateService} from '@ngx-translate/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-search-transports',
  templateUrl: './search-transports.component.html',
  styleUrls: ['./search-transports.component.css'],
  providers: [DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}, FormGroupDirective,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},]
})
export class SearchTransportsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];



  transportToSearch: TransportForSearch = new TransportForSearch(
    new Location(null, null, '', '', '', '', '', ''),
    new Location(null, null, '', '', '', '', '', ''), null, true, null, null);
  searchResults: PaginatedTransport;

  searchExpanded = true;
  resultsExpanded = false;


  constructor(
    private apiAccess: ApiAccessService,
    private contextMenuService: ContextMenuService,
    private route: ActivatedRoute,
    private router: Router,
    private geolocation: GeolocationService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private alerts: AlertService,
    private ts: TranslateService,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      const page = params.page || 1;
      const startLan = params.startLan;
      const startLat = params.startLat;
      const endLan = params.endLan;
      const endLat = params.endLat;
      const timeFrom = params.timeFrom;
      const timeTo = params.timeTo;
      const date = params.date;

      if (startLan && startLat && endLan && endLat && timeFrom && timeTo && date) {
        this.subscriptions.push(
          this.apiAccess.get<PaginatedTransport>('/transports/', false, {
            start_lan: endLan,
            start_lat: startLat,
            end_lat: endLat,
            end_lan: endLan,
            time_from: timeFrom,
            time_to: timeTo,
            date,
            page,
            page_size: 5
          }).subscribe(data => {
            this.searchResults = data;
          })
        );
        this.searchExpanded = false;
        this.resultsExpanded = true;
      } else {
        this.searchExpanded = true;
        this.resultsExpanded = false;
      }

    });
  }


  changeResultsPage(pageNumber: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {page: pageNumber},
      queryParamsHandling: 'merge'
    });
  }

  async search(formsAreValid: boolean, startLocationIsSelected: boolean, endLocationIsSelected: boolean, needToParseManualStartLocation: boolean, needToParseManualEndLocation: boolean, locationsCombo: LocationsOftenUsedMapManualComboComponent) {

    locationsCombo.updateStartAndEndLocationIfNecessary(async () => {
      if (!formsAreValid) {
        this.alerts.exceptionAlert('Enter all data');
      } else if (!startLocationIsSelected) {
        this.alerts.exceptionAlert('Select start location');
      } else if (!endLocationIsSelected) {
        this.alerts.exceptionAlert('Select end location');
      } else {


        if (needToParseManualStartLocation) {
          this.transportToSearch.startLocation = await this.geolocation.addressToCoordinates(
            this.geolocation.locationModelToAddressModel(this.transportToSearch.startLocation)
          );
        }
        if (needToParseManualEndLocation) {
          this.transportToSearch.endLocation = await this.geolocation.addressToCoordinates(
            this.geolocation.locationModelToAddressModel(this.transportToSearch.endLocation)
          );
        }


        this.router.navigate([], {
          queryParams: {
            startLan: this.transportToSearch.startLocation.lan,
            startLat: this.transportToSearch.startLocation.lat,
            endLat: this.transportToSearch.endLocation.lat,
            endLan: this.transportToSearch.endLocation.lan,
            timeFrom: this.transportToSearch.fullDay ? '00:00' : this.transportToSearch.timeFrom,
            timeTo: this.transportToSearch.fullDay ? '23:59' : this.transportToSearch.timeTo,
            date: this.convertDateToString(this.transportToSearch.date)
          }
        });
      }
    });
  }

  convertTimeToString(time) {
    return this.datePipe.transform(time, 'HH:mm');
  }

  convertDateToString(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  convertTimeStringToDate(timeString: string): Date {
    return new Date('1990-01-01 ' + timeString);
  }
}
