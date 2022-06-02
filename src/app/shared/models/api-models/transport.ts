import {UserShort} from './user-short';
import {Location} from './location';
import {Time} from '@angular/common';
import {Negotiability} from './negotiability';

export class Transport {
  constructor(
    public id: number,
    public driver: UserShort,
    public startLocation: Location&{id: number},
    public endLocation: Location&{id: number},
    public date: Date,
    public time: Time,
    public price: number,
    public numberOfSeats: number,
    public passengersWereFound: boolean,
    public stillAvailableSeats: number,
    public driverAvgRating: number,
    public driverNumberOfRatings: number,
    public posted: Date,
    public negotiability: Negotiability,
    public canceled: boolean,
    public comment?: string
  ) {
  }
}
