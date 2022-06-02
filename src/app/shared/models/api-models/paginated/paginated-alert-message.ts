import {Transport} from '../transport';
import {AlertMessage} from '../alert-message';

export class PaginatedAlertMessage {
  constructor(
    public next: string,
    public previous: string,
    public count: number,
    public currentPage: number,
    public results: AlertMessage[]
  ) {
  }
}
