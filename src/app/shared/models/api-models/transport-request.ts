import {Location} from './location';
import {Time} from '@angular/common';
import {Transport} from './transport';

export class TransportRequest {
  constructor(
    public id: number,
    public startLocation: Location,
    public endLocation: Location,
    public date: Date,
    public time: Time,
    public price: number,
    public numberOfSeats: number,
    public locationsWereUnchanged: boolean,
    public insideCampaign: number,
    public comment: string,
    public acceptedByDriver: boolean,
    public transport: Transport
  ){}
}
