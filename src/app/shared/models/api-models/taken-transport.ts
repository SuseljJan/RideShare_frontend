import {Location} from "./location";
import {Campaign} from "./campaign";
import {Time} from "@angular/common";
import {TransportHasPassengers} from "./transport-has-passengers";

export class TakenTransport {
  constructor(
    public transportHasPassengers: TransportHasPassengers[],
    public startLocation: Location,
    public endLocation: Location,
    public insideCampaign: Campaign,
    public date: Date,
    public time: Time,
    public price: number,
    public numberOfSeats: number,
    locationsWereUnchanged: boolean
  ){}
}
