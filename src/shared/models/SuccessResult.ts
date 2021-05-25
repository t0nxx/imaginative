import Result from './Result';
export default class SuccessResult extends Result {
  constructor(_data: any) {
    super('SUCCESS');
    this.data = _data;
  }
}
