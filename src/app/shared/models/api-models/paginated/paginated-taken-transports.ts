import {Transport} from '../transport';
import {TakenTransport} from '../taken-transport';
import {TransportRequest} from '../transport-request';

export class PaginatedTakenTransports {
  constructor(
    public next: string,
    public previous: string,
    public count: number,
    public currentPage: number,
    public results: TransportRequest[]
  ){}
}
