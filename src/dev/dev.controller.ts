import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import approot from 'app-root-path';
import Umzug from 'umzug';
import sequelize from './../shared/core/Database';
// import { Sequelize } from "sequelize";

// import { StatusCodes, getStatusText } from "http-status-codes";

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: { sequelize },
  migrations: {
    params: [sequelize.getQueryInterface(), sequelize],
    path: approot.resolve('migrations'),
  },
});

@ApiBearerAuth()
@ApiTags('DB_Migration')
@Controller()
export class DevController {
  constructor(/*private readonly listingService: ListingService*/) {}

  @Get('v1/database-migration')
  async databaseMigration(
    @Req() _req: Request,
    @Res() _res: Response,
  ): Promise<void> {
    /*if (!req.isAuthenticated() || !req.user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send(getStatusText(StatusCodes.NOT_FOUND));
      return;
    }*/
    await umzug.up();
  }
}
