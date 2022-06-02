import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ApiAccessService} from '../../../shared/services/api-access.service';
import {Transport} from '../../../shared/models/api-models/transport';
import {TransportRequestPost} from '../../../shared/models/api-models/transport-request-post';
import {Location} from '../../../shared/models/api-models/location';
import {Campaign} from '../../../shared/models/api-models/campaign';
import {DatePipe} from '@angular/common';
import {GeolocationService} from '../../../shared/services/geolocation.service';
import {AlertService} from '../../../shared/services/alert.service';
import {LocationsOftenUsedMapManualComboComponent} from '../../../shared/components/locations-often-used-map-manual-combo/locations-often-used-map-manual-combo.component';
import Swal from 'sweetalert2';
import {CampaignPost} from '../../../shared/models/api-models/campaign-post';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-create-transport-request',
  templateUrl: './create-transport-request.component.html',
  styleUrls: ['./create-transport-request.component.css'],
  providers: [DatePipe]
})
export class CreateTransportRequestComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  activeCampaigns: Campaign[];
  transport: Transport & { stillAvailableSeats: number };
  transportRequest: TransportRequestPost = new TransportRequestPost(
    new Location(null, null, '', '', '', '', '', ''),
    new Location(null, null, '', '', '', '', '', ''),
    '', '', 0, 0, true, null, '', null
  );
  keepTheSameLocations = true;
  keepTheSameDetails = true;
  useCampaign = false;


  constructor(
    private route: ActivatedRoute,
    private apiAccess: ApiAccessService,
    private datePipe: DatePipe,
    private geolocation: GeolocationService,
    private alerts: AlertService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.preloadActiveCampaigns();

    this.route.paramMap.subscribe((params: Params) => {
      const transportId = params.get('id');
      this.transportRequest.transport = transportId;

      this.subscriptions.push(
        this.apiAccess.get<Transport>(`/transports/with_negotiability/${transportId}/`).subscribe(data => {
          this.transport = data;
          this.transportRequest.copyTransportToTransportRequest(data, this.datePipe);
          this.transportRequest.numberOfSeats = this.transport.stillAvailableSeats;
        })
      );

    });

  }

  preloadActiveCampaigns() {
    this.subscriptions.push(
      this.apiAccess.get<Campaign[]>('/campaigns/non_paginated/', true, {active: true}).subscribe(data => {
        this.activeCampaigns = data;
      })
    );

  }


  async createTransportRequest(formsAreValid: boolean, startLocationIsSelected: boolean, endLocationIsSelected: boolean, needToParseManualStartLocation: boolean, needToParseManualEndLocation: boolean, locationsUnchanged: boolean, detailsUnchanged: boolean, locationsCombo: LocationsOftenUsedMapManualComboComponent) {
    if (locationsUnchanged) {
      this.transportRequest.startLocationId = this.transport.startLocation.id;
      this.transportRequest.endLocationId = this.transport.endLocation.id;
    }
    if (detailsUnchanged) {
      this.transportRequest.price = this.transport.price;
      this.transportRequest.numberOfSeats = this.transport.stillAvailableSeats;
      this.transportRequest.date = this.transport.date;
      this.transportRequest.time = this.transport.time;
    }

    // if (formsAreValid) {
      if (locationsUnchanged) {
        this.postTransportRequestToBackendAndRedirect(this.transportRequest);
      } else if (!startLocationIsSelected || !endLocationIsSelected) {
        this.alerts.exceptionAlert('Select start and end location');
      } else {
        locationsCombo.updateStartAndEndLocationIfNecessary(() => {
          this.geolocation.parseStartAndEndIfNecessary(this.transportRequest, needToParseManualStartLocation, needToParseManualEndLocation, result => {
            this.transportRequest = result;
          });

          this.postTransportRequestToBackendAndRedirect(this.transportRequest);
        });

      }
    // } else {
    //   this.alerts.exceptionAlert('Enter all data');
    // }

  }

  postTransportRequestToBackendAndRedirect(transportRequest: TransportRequestPost) {
    this.subscriptions.push(
      this.apiAccess.post('/transport_requests/', transportRequest, true).subscribe(data => {
        this.alerts.createdAlert('Transport request was send. We\'ll inform you once the driver accepts your request.');
        this.router.navigate(['/me/transports']);
      })
    );
  }

  createCampaignWithPopup() {
    Swal.fire({
      title: 'Create campaign',
      text: 'Enter name of your new campaign',
      input: 'text',
      showCancelButton: true
    }).then((result) => {
      console.log(result);
      if (result.value && result.value !== '') {
        this.subscriptions.push(
          this.apiAccess.post('/campaigns/all/', new CampaignPost(result.value), true)
            .subscribe(data => {
              this.preloadActiveCampaigns();
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
