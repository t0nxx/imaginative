export default class OperationResult {
  public success = true;
  /// code will be deleted
  public code?: string;
  public statusCode = 200;
  public message?: string = null;
  public data: any = null;
  public meta: any = null;
}
