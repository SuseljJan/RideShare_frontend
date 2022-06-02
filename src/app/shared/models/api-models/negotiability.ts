export class Negotiability {
  constructor(
    public id: number,
    public dateIsNegotiable: boolean,
    public timeIsNegotiable: boolean,
    public priceIsNegotiable: boolean,
    public numberOfSeatsAreNegotiable: boolean,
    public startLocationIsNegotiable: boolean,
    public endLocationIsNegotiable: boolean,
  ){}
}
