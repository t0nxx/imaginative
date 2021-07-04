import {
  Controller,
  Post,
  UseInterceptors,
  Param,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';

@ApiTags('Files')
@Controller()
export class FilesController {
  constructor(private fileService: FileService) {}

  @ApiOperation({ summary: 'Uploads a file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Post('v1/files/upload')
  async uploadFile(@UploadedFile('file') file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @ApiOperation({ summary: 'Deletes a file given name' })
  @Delete('v1/files/:key')
  async deleteFile(@Param('key') key: string) {
    return this.fileService.removeFile(key);
  }
}
