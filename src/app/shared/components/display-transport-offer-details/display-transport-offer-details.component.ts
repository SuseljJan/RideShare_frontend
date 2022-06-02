import {Component, Input, OnInit} from '@angular/core';
import {Transport} from '../../models/api-models/transport';

@Component({
  selector: 'app-display-transport-offer-details',
  templateUrl: './display-transport-offer-details.component.html',
  styleUrls: ['./display-transport-offer-details.component.css']
})
export class DisplayTransportOfferDetailsComponent implements OnInit {
  @Input() transport: Transport;
  @Input() displayDriver: boolean;

  constructor() { }

  ngOnInit() {

  }

}
