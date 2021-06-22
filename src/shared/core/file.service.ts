import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import { v4 } from 'uuid';
import OperationResult from '../models/OperationResult';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File) {
    AWS.config.update({
      accessKeyId: this.configService.get('accessKeyId'),
      secretAccessKey: this.configService.get('secretAccessKey'),
      region: this.configService.get('region'),
    });
    const s3 = new AWS.S3();

    const fileName = `${v4()}${path.extname(file.originalname)}`;

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('bucket'),
        Body: file.buffer,
        Key: fileName,
        ACL: 'public-read',
        ContentType: file.mimetype,
      })
      .promise();

    const result = {
      key: uploadResult.Key,
      url: uploadResult.Location,
      type: file.mimetype.split('/')[0],
    };
    const res = new OperationResult();
    res.message[0] = 'successfully uploaded';
    res.data = result;
    return res;
  }

  async removeFile(key: string) {
    AWS.config.update({
      accessKeyId: this.configService.get('accessKeyId'),
      secretAccessKey: this.configService.get('secretAccessKey'),
      region: this.configService.get('region'),
    });
    const s3 = new AWS.S3();

    const result = await s3
      .deleteObject({
        Bucket: this.configService.get('bucket'),
        Key: key,
      })
      .promise();

      console.log(result);
    const res = new OperationResult();
    res.message[0] = 'successfully deleted';
    return res;
  }
}
