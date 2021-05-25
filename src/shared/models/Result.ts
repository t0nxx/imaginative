export default class Result {
  constructor(status: string) {
    this.status = status;
  }

  public status: string;
  public error: any = null;
  public data: any = null;
}
