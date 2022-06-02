import {Transport} from '../transport';
import {Campaign} from '../campaign';

export class PaginatedCampaign {
  constructor(
    public next: string,
    public previous: string,
    public count: number,
    public currentPage: number,
    public results: Campaign[]
  ) {
  }
}
