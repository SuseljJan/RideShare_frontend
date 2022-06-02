import {Location} from './location';
import {DatePipe, Time} from '@angular/common';
import {Transport} from './transport';

export class TransportRequestPost {
  constructor(
    public startLocation: Location,
    public endLocation: Location,
    public date: Date|string,
    public time: Time|string,
    public price: number,
    public numberOfSeats: number,
    public locationsWereUnchanged: boolean,
    public insideCampaign: number,
    public comment: string,
    public transport: number,
    public startLocationId?: number,
    public endLocationId?: number,
  ){}
   copyTransportToTransportRequest(transport: Transport, datePipe: DatePipe) {
    this.startLocation = transport.startLocation;
    this.endLocation = transport.endLocation;
    this.date = transport.date;

    const splitedTime = transport.time.toString().split(':');
    const datedTime = new Date(1999,1,1, parseInt(  splitedTime[0]), parseInt(splitedTime[1]), parseInt(splitedTime[2]));
    this.time = datePipe.transform(datedTime, 'HH:mm');

    this.price = transport.price;
    this.numberOfSeats = transport.numberOfSeats;

  }
}
