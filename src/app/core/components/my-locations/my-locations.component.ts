import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {PaginatedOftenUsedLocation} from '../../../shared/models/api-models/paginated/paginated-often-used-location';
import {LocationCoordinates} from '../../../shared/models/angular-models/location-coordinates';
import {Coordinates} from '../../../shared/models/angular-models/coordinates';
import {GeolocationService} from '../../../shared/services/geolocation.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OftenUsedLocationPost} from '../../../shared/models/api-models/often-used-location-post';
import {AlertService} from '../../../shared/services/alert.service';
import {LeafletLocationPickerComponent} from '../../../shared/components/leaflet-location-picker/leaflet-location-picker.component';
import {DisplayLocationsFormComponent} from '../../../shared/components/display-locations-form/display-locations-form.component';
import {Subscribable, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-my-locations',
  templateUrl: './my-locations.component.html',
  styleUrls: ['./my-locations.component.css', '../../../shared/styles/forms.css']
})
export class MyLocationsComponent implements OnInit, OnDestroy {
  locations: PaginatedOftenUsedLocation;
  locationToPost: OftenUsedLocationPost = new OftenUsedLocationPost(null, null, '', '', '', '', '', '', '');

  @ViewChild(DisplayLocationsFormComponent, {static: false}) locationsForm: DisplayLocationsFormComponent;

  subscriptions: Subscription[] = [];

  existingLocationsExpand = true;
  createLocationExpand = true;
  detailsExpanded = false;
  mapExpanded = true;
  locationEnteredManually = false;

  constructor(
    private apiAccess: ApiAccessService,
    private geolocation: GeolocationService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private ts: TranslateService,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      const page = params.page || 1;

      this.subscriptions.push(
        this.apiAccess.get<PaginatedOftenUsedLocation>('/locations/users_often_used/', true, {page_size: 5, page}, new Map([[404, (err) => {
          // If we remove last element in the list we're gonna get 404 from django server
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {page: page - 1},
            queryParamsHandling: 'merge'
          });
        }]])).subscribe(data => {
          this.locations = data;
        })
      );
    });
  }


  setOrChangeLocation(location: LocationCoordinates) {
    this.geolocation.coordinatesToAddress(new Coordinates(location.lat, location.lng))
      .then(result => {
        this.locationToPost = {...result, name: this.locationToPost.name};
        this.cdr.detectChanges();
      });
  }

  async createOftenUsedLocation(formIsValid: boolean, needToParseLocation: boolean, locationPicker: LeafletLocationPickerComponent) {
    if (formIsValid) {
      if (needToParseLocation) {
        const geocodedLocation = await this.geolocation.addressToCoordinates(
          this.geolocation.locationModelToAddressModel(this.locationToPost)
        );
        this.locationToPost = {...geocodedLocation, name: this.locationToPost.name};
      }

      this.subscriptions.push(
        this.apiAccess.post('/locations/users_often_used/', this.locationToPost, true, null).subscribe(data => {

          this.locationToPost = new OftenUsedLocationPost(null, null, '', '', '', '', '', '', '');
          locationPicker.removeAllMarkers();
          this.locationsForm.markAsCleanAndUntouched();
          this.locationEnteredManually = false;
          this.alertService.createdAlert('Location was saved');
          this.ngOnInit();

          this.createLocationExpand = false;
          this.existingLocationsExpand = true;
        })
      );
    } else {
      this.alertService.exceptionAlert('Enter all data');
    }
  }

  changePage(pageNumber: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {page: pageNumber},
      queryParamsHandling: 'merge'
    });
  }

  removeOftenUsedLocation(locationId: number) {
    this.subscriptions.push(
      this.apiAccess.delete<any>(`/locations/users_often_used/${locationId}/`, true).subscribe(data => {
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
