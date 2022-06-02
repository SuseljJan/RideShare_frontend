export class AlertMessageMongo {
  constructor(
    // tslint:disable-next-line:variable-name
    public _id: number,
    public title: string,
    public message: string,
    public created: Date,
    public archived: boolean,
    public read: boolean
  ) {
  }
}
