import {UserShort} from './user-short';
import {Location} from './location';
import {Time} from '@angular/common';
import {NegotiabilityPost} from './negotiability-post';

export class TransportPost {
  constructor(
    public date: Date|string,
    public time: Date|string,
    public price: number,
    public numberOfSeats: number,
    public comment: string,
    public negotiability: NegotiabilityPost,
    public startLocation?: Location,
    public endLocation?: Location,
    public startLocationId?: number,
    public endLocationId?: number,
  ) {
  }
}
