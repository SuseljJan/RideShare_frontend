import {TakenTransport} from '../taken-transport';
import {PassengersOffer} from '../passengers-offer';

export class PaginatedPassengersOffer {
  constructor(
    public next: string,
    public previous: string,
    public count: number,
    public currentPage: number,
    public results: PassengersOffer[]
  ){}
}
