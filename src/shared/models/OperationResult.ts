export default class OperationResult {
  public success = true;
  public code?: string;
  public message?: string;
  public data: any = {};
  public meta: any = {};
}
