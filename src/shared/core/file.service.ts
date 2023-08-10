import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as path from 'path';
import { v4 } from 'uuid';
import OperationResult from '../models/OperationResult';
import { PrismaService } from './prisma.service';

@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService,
    private readonly db: PrismaService,
  ) {}

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
    const newfile = await this.db.files.create({
      data: {
        key: uploadResult.Key,
        url: uploadResult.Location,
        type: file.mimetype.split('/')[0],
      },
    });
    const res = new OperationResult();
    res.message[0] = 'successfully uploaded';
    res.data = newfile;
    return res;
  }

  async removeFile(url: string) {
    const file = await this.db.files.findFirst({
      where: {
        url: url,
      },
    });
    AWS.config.update({
      accessKeyId: this.configService.get('accessKeyId'),
      secretAccessKey: this.configService.get('secretAccessKey'),
      region: this.configService.get('region'),
    });
    const s3 = new AWS.S3();

    const result = await s3
      .deleteObject({
        Bucket: this.configService.get('bucket'),
        Key: file.key,
      })
      .promise();

    await this.db.files.delete({
      where: {
        id: file.id,
      },
    });
    const res = new OperationResult();
    res.message[0] = 'successfully deleted';
    return res;
  }

  async getFile(id: number) {
    const file = await this.db.files.findUnique({
      where: {
        id: id,
      },
    });
    const res = new OperationResult();
    res.message[0] = 'done';
    res.data = file;
    return res;
  }

  async getMultipleFiles(ids: number[]) {
    const files = await this.db.files.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    const res = new OperationResult();
    res.message[0] = 'done';
    res.data = files;
    return res;
  }
}
