import {TakenTransport} from '../taken-transport';
import {Review} from '../review';

export class PaginatedReview {
  constructor(
    public next: string,
    public previous: string,
    public count: number,
    public currentPage: number,
    public results: Review[]
  ){}
}
