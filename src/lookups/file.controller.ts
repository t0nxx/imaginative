import {
  Controller,
  Post,
  UseInterceptors,
  Param,
  Get,
  Res,
  Req,
  UploadedFile,
  Delete,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import * as path from 'path';
import { v4 } from 'uuid';
import env from '@/shared/core/Environment';
import { LookupsService } from './lookups.service';

const domain = env.APP_DOMAIN;

@ApiBearerAuth()
@ApiTags('Files')
@Controller()
export class FilesController {
  constructor(private lookupService: LookupsService) {}

  @ApiOperation({ summary: 'Uploads a file to a given bucket' })
  @UseInterceptors(FileInterceptor('file'))
  @Post('v1/files/:bucket/:type/upload')
  async uploadFile(
    @Param('bucket') bucket: string,
    @Param('type') type: string,
    @Req() _req: Request,
    @UploadedFile() file,
  ): Promise<any> {
    const fileName = `${v4()}${path.extname(file.originalname)}`;
    this.lookupService.saveFile(bucket, type, fileName, file.buffer);
    return {
      url: `${domain}/api/v1/files/${bucket}/${type}/${fileName}`,
      bucket: bucket,
      type: type,
      fileName: fileName,
    };
  }

  @ApiOperation({ summary: 'Gets a file given its bucket, type and name' })
  @Get('v1/files/:bucket/:type/:name')
  async getFile(
    @Param('bucket') bucket: string,
    @Param('type') type: string,
    @Param('name') name: string,
    @Res() _res: Response,
  ): Promise<any> {
    const file = this.lookupService.getFile(bucket, type, name);
    if (!file) return _res.sendStatus(404);
    return _res.sendFile(file);
  }

  @ApiOperation({ summary: 'Deletes a file given its bucket, type and name' })
  @Delete('v1/files/:bucket/:type/:name')
  async deleteFile(
    @Param('bucket') bucket: string,
    @Param('type') type: string,
    @Param('name') name: string,
    @Res() _res: Response,
  ): Promise<any> {
    const success = this.lookupService.deleteFile(bucket, type, name);
    if (success === false) return _res.sendStatus(404);
    return _res.send({ status: 'SUCCESS' });
  }

  @ApiOperation({
    summary:
      'Duplicates the media files and returns new list with new file urls',
  })
  @Post('v1/files/duplicate')
  async duplicateFiles(@Body() mediaFiles: Array<any>): Promise<any> {
    if (mediaFiles) {
      const newMediaFiles: Array<any> = [];
      for (const media of mediaFiles) {
        if (media.bucket && media.type && media.fileName) {
          const newFileName = this.lookupService.duplicateFile(
            media.bucket,
            media.type,
            media.fileName,
          );
          const newMedia = {
            url: media.url.replace(media.fileName, newFileName),
            fileName: newFileName,
            type: media.type,
            bucket: media.bucket,
          };
          newMediaFiles.push(newMedia);
        }
      }
      return newMediaFiles;
    }
    return null;
  }
}
