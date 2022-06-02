import {TakenTransport} from '../taken-transport';
import {Transport} from '../transport';

export class PaginatedTransport {
  constructor(
    public next: string,
    public previous: string,
    public count: number,
    public currentPage: number,
    public results: Transport[]
  ){}
}
