import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TransportPost} from '../../../shared/models/api-models/transport-post';
import {Location} from '../../../shared/models/api-models/location';

import {ApiAccessService} from '../../../shared/services/api-access.service';
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';
import {LocationCoordinates} from '../../../shared/models/angular-models/location-coordinates';
import {GeolocationService} from '../../../shared/services/geolocation.service';
import {DatePipe, Time} from '@angular/common';
import {AlertService} from '../../../shared/services/alert.service';
import {Router} from '@angular/router';
import {OftenUsedLocation} from '../../../shared/models/api-models/often-used-location';
import {LeafletLocationPickerComponent} from '../../../shared/components/leaflet-location-picker/leaflet-location-picker.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NegotiabilityPost} from '../../../shared/models/api-models/negotiability-post';
import {LocationsOftenUsedMapManualComboComponent} from '../../../shared/components/locations-often-used-map-manual-combo/locations-often-used-map-manual-combo.component';
import {Subscription} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-create-transport',
  templateUrl: './create-transport.component.html',
  styleUrls: ['./create-transport.component.css'],
  providers: [DatePipe, TranslatePipe]
})
export class CreateTransportComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  transport: TransportPost = new TransportPost(
    null, null, 0, 0, '',
    new NegotiabilityPost(false, true, true, true, true, true),
    new Location(null, null, '', '', '', '', '', ''),
    new Location(null, null, '', '', '', '', '', ''));


  oftenUsedLocations: OftenUsedLocation[];


  constructor(
    private apiAccess: ApiAccessService,
    private cdr: ChangeDetectorRef,
    private geolocation: GeolocationService,
    private datePipe: DatePipe,
    private alerts: AlertService,
    private router: Router,
    private translate: TranslatePipe,
  ) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.apiAccess.get<OftenUsedLocation[]>('/locations/users_often_used_all/', true).subscribe(data => {
        this.oftenUsedLocations = data;
      })
    );
  }

  convertTimeToString(time) {
    return this.datePipe.transform(time, 'HH:mm');
  }

  convertDateToString(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  async createTransport(formsAreValid: boolean, startLocationIsSelected: boolean, endLocationIsSelected: boolean, needToParseManualStartLocation: boolean, needToParseManualEndLocation: boolean, locationsCombo: LocationsOftenUsedMapManualComboComponent) {
    locationsCombo.updateStartAndEndLocationIfNecessary(async () => {

      console.log('transportfromform', this.transport);


      if (!formsAreValid) {
        this.alerts.exceptionAlert('Enter all data');
      } else if (!startLocationIsSelected) {
        this.alerts.exceptionAlert('Select start location');
      } else if (!endLocationIsSelected) {
        this.alerts.exceptionAlert('Select end location');
      } else {
        const transportToCreate = {...this.transport};

        console.log(this.transport.startLocation);
        transportToCreate.date = this.convertDateToString(transportToCreate.date);

        if (needToParseManualStartLocation) {
          transportToCreate.startLocation = await this.geolocation.addressToCoordinates(
            this.geolocation.locationModelToAddressModel(transportToCreate.startLocation)
          );
        }
        if (needToParseManualEndLocation) {
          transportToCreate.endLocation = await this.geolocation.addressToCoordinates(
            this.geolocation.locationModelToAddressModel(transportToCreate.endLocation)
          );
        }

        if (transportToCreate.startLocation.lat == null) {
          transportToCreate.startLocation = null;
        }
        if (transportToCreate.endLocation.lat == null) {
          transportToCreate.endLocation = null;
        }

        this.subscriptions.push(
          this.apiAccess.post<any>('/transports/', transportToCreate, true)
            .subscribe(data => {
              this.alerts.createdAlert('Transport offer was created. We will inform you once you get requests for your transport offer.');
              this.router.navigate(['/me/transports']);
            })
        );

      }

    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
