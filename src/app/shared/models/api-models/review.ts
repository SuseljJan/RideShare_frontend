import {UserShort} from './user-short';

export class Review {

  constructor(
    public id: number,
    public reviewer: UserShort,
    public numberOfStars: number,
    public comment: string,
    public createdAt: Date,
  ) {
  }
}
