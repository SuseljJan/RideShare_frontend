import {Location} from './location';
import {Time} from '@angular/common';

export class PassengersOffer {
  constructor(
    public id: number,
    public startLocation: Location,
    public endLocation: Location,
    public date: Date,
    public time: Time,
    public price: number,
    public numberOfSeats: number,
    public locationsWereUnchanged: boolean,
    public posted: Date
  ){}
}
