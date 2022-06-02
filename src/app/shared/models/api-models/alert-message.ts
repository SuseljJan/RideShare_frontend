export class AlertMessage {
  constructor(
    public id: number,
    public posted: Date,
    public message: string,
    public archived: boolean,
    public read: boolean
  ) {
  }
}
