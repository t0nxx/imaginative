import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import logger from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { serviceAccount } from './shared/core/FireBaseAdminKeys';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(ApplicationModule, appOptions);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(logger('dev'));
  const options = new DocumentBuilder()
    .setTitle('Imaginative News API v1')
    .setDescription(
      'This is version 1 of the API application of Imaginative News App',
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMzMzFkZjlmLWI1NzQtNDVkYS1hODNmLTVjODM2ZjgwOGQxNiIsIm5hbWUiOiJ0ZXN0MSIsImVtYWlsIjoiYUBhLmNvbSIsImV4cCI6MTYyNzA3MDQ4Ny43OTQsImlhdCI6MTYyMTg4NjQ4N30.125A_XjdRcK1e5hT1s8nIgG0XWakDixKtG-bmZp_Rsg
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  console.log(
    `******************** app started in ${process.env.NODE_ENV}  enviroment `,
  );

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: serviceAccount.project_id,
      privateKey: serviceAccount.private_key,
      clientEmail: serviceAccount.client_email,
    }),
  });

  await app.listen(process.env.PORT || 5000);
}
bootstrap();
