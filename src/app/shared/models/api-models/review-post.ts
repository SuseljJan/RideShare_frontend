import {UserShort} from './user-short';

export class ReviewPost {
  constructor(
    public numberOfStars: number,
    public comment: string,
    public reviewed: number,
  ) {
  }
}
