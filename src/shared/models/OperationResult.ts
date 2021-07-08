import { ApiProperty } from '@nestjs/swagger';

export default class OperationResult {
  /// code will be deleted
  public code?: string;

  @ApiProperty({ default: true })
  public success = true;
  @ApiProperty({ default: 200 })
  public statusCode = 200;
  @ApiProperty()
  public message?: any[] = [];
  @ApiProperty({ default: null })
  public data: any = null;
  @ApiProperty({ default: null })
  public meta: any = null;
}
