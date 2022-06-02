import {Transport} from '../transport';
import {Location} from '../location';
import {OftenUsedLocation} from '../often-used-location';

export class PaginatedOftenUsedLocation {
  constructor(
    public next: string,
    public previous: string,
    public count: number,
    public currentPage: number,
    public results: OftenUsedLocation[]
  ){}
}
