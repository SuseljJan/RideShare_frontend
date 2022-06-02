import {Transport} from '../transport';
import {GivenTransport} from '../given-transport';

export class PaginatedGivenTransports {
  constructor(
    public next: string,
    public previous: string,
    public count: number,
    public currentPage: number,
    public results: GivenTransport[]
  ) {
  }
}
