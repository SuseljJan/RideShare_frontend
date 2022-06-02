import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {OftenUsedLocation} from '../../models/api-models/often-used-location';
import {LeafletLocationPickerComponent} from '../leaflet-location-picker/leaflet-location-picker.component';
import {Location} from '../../models/api-models/location';
import {ApiAccessService} from '../../services/api-access.service';
import {LocationCoordinates} from '../../models/angular-models/location-coordinates';
import {GeolocationService} from '../../services/geolocation.service';
import {DisplayLocationsFormComponent} from '../display-locations-form/display-locations-form.component';
import {AuthService} from '../../services/auth.service';
import {Coordinates} from '../../models/angular-models/coordinates';
import {LatLngExpression} from 'leaflet';
import {Subscription} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-locations-often-used-map-manual-combo',
  templateUrl: './locations-often-used-map-manual-combo.component.html',
  styleUrls: ['./locations-often-used-map-manual-combo.component.css'],
  providers: [TranslatePipe]
})
export class LocationsOftenUsedMapManualComboComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  oftenUsedLocations: OftenUsedLocation[];

  enterManuallyExpanded = false;
  enterManuallyStartIsNotLatestLocation = false;
  enterManuallyEndIsNotLatestLocation = false;


  manualStartInputFormChanged = false;
  manualEndInputFormChanged = false;

  @Input() startLocationToPreload: LatLngExpression = null;
  @Input() endLocationToPreload: LatLngExpression = null;

  @Input() startLocation: Location;
  @Output() startLocationChange: EventEmitter<Location> = new EventEmitter<Location>();

  @Input() endLocation: Location;
  @Output() endLocationChange: EventEmitter<Location> = new EventEmitter<Location>();

  @Input() oftenUsedStartLocationId: number = null;
  @Output() oftenUsedStartLocationIdChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() oftenUsedEndLocationId: number = null;
  @Output() oftenUsedEndLocationIdChange: EventEmitter<number> = new EventEmitter<number>();

  private START_LOCATION_IS_NEGOTIABLE = true;

  @Input()
  get startLocationIsNegotiable(): boolean {
    return this.START_LOCATION_IS_NEGOTIABLE;
  }

  set startLocationIsNegotiable(val: boolean) {
    this.startLocationIsNegotiableChange.emit(val);
    this.START_LOCATION_IS_NEGOTIABLE = val;
  }

  @Output() startLocationIsNegotiableChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private END_LOCATION_IS_NEGOTIABLE = true;

  @Input()
  get endLocationIsNegotiable(): boolean {
    return this.END_LOCATION_IS_NEGOTIABLE;
  }

  set endLocationIsNegotiable(val: boolean) {
    this.endLocationIsNegotiableChange.emit(val);
    this.END_LOCATION_IS_NEGOTIABLE = val;
  }

  @Output() endLocationIsNegotiableChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  @Input() startLocationPickerIsEnabled = true;
  @Input() endLocationPickerIsEnabled = true;


  @Input() displayNegotiability = false;
  @Input() enableAllControls = false;

  // Exposed to use from other (parent) components
  @ViewChild('startLocationForm', {static: false}) startLocationForm: DisplayLocationsFormComponent;
  @ViewChild('endLocationForm', {static: false}) endLocationForm: DisplayLocationsFormComponent;
  @ViewChild(LeafletLocationPickerComponent, {static: false}) mapPicker: LeafletLocationPickerComponent;


  constructor(
    private apiAccess: ApiAccessService,
    private geolocation: GeolocationService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private  translate: TranslatePipe,
  ) {
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.apiAccess.get<OftenUsedLocation[]>('/locations/users_often_used_all/', true).subscribe(data => {
        this.oftenUsedLocations = data;
      });
    }
  }

  startLocationIsSelected(): boolean {
    return this.mapPicker.startLocationIsMarked() || this.oftenUsedStartLocationId != null || this.startLocationForm.locationsForm.touched;
  }

  endLocationIsSelected(): boolean {
    return this.mapPicker.endLocationIsMarked() || this.oftenUsedEndLocationId != null || this.endLocationForm.locationsForm.touched;
  }


  selectOftenUsedStartLocation(mapPicker: LeafletLocationPickerComponent, startLocationsForm, selectedLocationId: number) {
    mapPicker.removeStartLocation();
    mapPicker.updateToggle(true);
    startLocationsForm.markAsCleanAndUntouched();

    this.oftenUsedStartLocationIdChange.emit(this.oftenUsedStartLocationId);

    this.manualStartInputFormChanged = false;
    this.getOftenUsedLocation(selectedLocationId, data => {
      this.startLocation = data;
      this.startLocationChange.emit(data);
      this.enterManuallyStartIsNotLatestLocation = false;
    });

  }

  selectOftenUsedEndLocation(mapPicker: LeafletLocationPickerComponent, endLocationsForm, selectedLocationId: number) {
    mapPicker.removeEndLocation();
    mapPicker.updateToggle(false);
    endLocationsForm.markAsCleanAndUntouched();

    this.oftenUsedEndLocationIdChange.emit(this.oftenUsedEndLocationId);

    this.manualEndInputFormChanged = false;
    this.getOftenUsedLocation(selectedLocationId, data => {
      this.endLocation = data;
      this.endLocationChange.emit(data);
      this.enterManuallyEndIsNotLatestLocation = false;
    });
  }

  getOftenUsedLocation(id: number, subscribeCallback) {
    this.subscriptions.push(
      this.apiAccess.get<Location>(`/locations/users_often_used/${id}/`, true).subscribe(subscribeCallback)
    );
  }

  async locationChangedOnMap(location: LocationCoordinates, startLocationForm, endLocationForm) {

    if (this.enterManuallyExpanded) {
      this.geolocation.coordinatesToAddress(location)
        .then(result => {
          if (location.isStart) {
            this.oftenUsedStartLocationId = null;
            startLocationForm.markAsCleanAndUntouched();
            this.manualStartInputFormChanged = false;
            this.startLocation = result;
            this.startLocationChange.emit(result);

          } else {
            this.oftenUsedEndLocationId = null;
            endLocationForm.markAsCleanAndUntouched();
            this.manualEndInputFormChanged = false;
            this.endLocation = result;
            this.endLocationChange.emit(result);
          }
          this.cdr.detectChanges();
        });

    } else {
      if (location.isStart) {
        this.enterManuallyStartIsNotLatestLocation = true;
        this.oftenUsedStartLocationId = null;
        startLocationForm.markAsCleanAndUntouched();
        this.manualStartInputFormChanged = false;
      } else {
        this.enterManuallyEndIsNotLatestLocation = true;
        this.oftenUsedEndLocationId = null;
        endLocationForm.markAsCleanAndUntouched();
        this.manualEndInputFormChanged = false;
      }
    }

  }

  private updateStartLocation(startLocation: Location) {
    this.oftenUsedStartLocationId = null;
    this.startLocationForm.markAsCleanAndUntouched();
    this.manualStartInputFormChanged = false;
    this.startLocation = startLocation;
    this.startLocationChange.emit(startLocation);
  }

  private updateEndLocation(endLocation: Location) {
    this.oftenUsedEndLocationId = null;
    this.endLocationForm.markAsCleanAndUntouched();
    this.manualEndInputFormChanged = false;
    this.endLocation = endLocation;
    this.endLocationChange.emit(endLocation);
  }

  // Must be called before posting form which contains locations-combo component
  updateStartAndEndLocationIfNecessary(successCallback: () => void) {
    if (this.enterManuallyStartIsNotLatestLocation && this.enterManuallyEndIsNotLatestLocation) {
      const startLocationMarker = this.mapPicker.startLocation.getLatLng();
      const endLocationMarker = this.mapPicker.endLocation.getLatLng();

      Promise.all([
        this.geolocation.coordinatesToAddress(new Coordinates(startLocationMarker.lat, startLocationMarker.lng)),
        this.geolocation.coordinatesToAddress(new Coordinates(endLocationMarker.lat, endLocationMarker.lng))
      ]).then((result: any[]) => {
        this.updateStartLocation(result[0]);
        this.updateEndLocation(result[1]);

        this.cdr.detectChanges();
        successCallback();
      });
    }
    if (!this.enterManuallyStartIsNotLatestLocation && !this.enterManuallyEndIsNotLatestLocation) {
      successCallback();
    }

    if (this.enterManuallyStartIsNotLatestLocation) {
      const startLocationMarker = this.mapPicker.startLocation.getLatLng();

      this.geolocation.coordinatesToAddress(new Coordinates(startLocationMarker.lat, startLocationMarker.lng))
        .then(result => {
          this.updateStartLocation(result);
          this.cdr.detectChanges();
          successCallback();
        });
    }
    if (this.enterManuallyEndIsNotLatestLocation) {
      const endLocationMarker = this.mapPicker.endLocation.getLatLng();
      this.geolocation.coordinatesToAddress(new Coordinates(endLocationMarker.lat, endLocationMarker.lng))
        .then(result => {
          this.updateEndLocation(result);

          this.cdr.detectChanges();
          successCallback();
        });
    }
  }

  manualLocationsInputExpandedChange(isExpanded: boolean) {
    if (isExpanded) {
      this.updateStartAndEndLocationIfNecessary(() => {/* do nothing*/
      });
    }
  }

  clearOftenUsedStartLocation(mapPicker: LeafletLocationPickerComponent) {
    this.oftenUsedStartLocationId = null;
    this.oftenUsedStartLocationIdChange.emit(null);

    this.mapPicker.toggleForStartIsEnabled = true;
    this.mapPicker.toggleLocationIsEnd = false;
  }

  clearOftenUsedEndLocation(mapPicker: LeafletLocationPickerComponent) {
    this.oftenUsedEndLocationId = null;
    this.oftenUsedEndLocationIdChange.emit(null);

    this.mapPicker.toggleForEndIsEnabled = true;
    this.mapPicker.toggleLocationIsEnd = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
