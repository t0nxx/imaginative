import Result from './Result';
export default class ErrorResult extends Result {
  constructor(err: any) {
    super('ERROR');
    this.error = err;
  }

  public error: any;
}
