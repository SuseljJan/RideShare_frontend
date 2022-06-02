import {Review} from './review';


export class UserWithReviews {

  constructor(
    public id: number,
    public username: string,
    public email: string,
    public reviewed: Review[],
    public avgRating: number,
    public numberOfRatings: number,
  ) {
  }


}
