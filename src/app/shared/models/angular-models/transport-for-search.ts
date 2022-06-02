import {Location} from '../api-models/location';
import {Time} from '@angular/common';

export class TransportForSearch {
  constructor(
    public startLocation: Location,
    public endLocation: Location,
    public date: Date|string,
    public fullDay: boolean,
    public timeFrom: Time|string,
    public timeTo: Time|string,
    public startLocationId?: number,
    public endLocationId?: number,
  ){}
}
