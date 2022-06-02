import {Component, Input, OnInit} from '@angular/core';
import {Location} from '../../models/api-models/location';

@Component({
  selector: 'app-display-location',
  templateUrl: './display-location.component.html',
  styleUrls: ['./display-location.component.css']
})
export class DisplayLocationComponent implements OnInit {

  constructor() { }

  @Input() location: Location;

  ngOnInit() {
  }

}
