import {AlertMessageMongo} from '../alert-message-mongo';


export class PaginatedAlertMessageMongo {
  constructor(
    public count: number,
    public currentPage: number,
    public results: AlertMessageMongo[]
  ) {
  }
}
