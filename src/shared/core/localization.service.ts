import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class LocalizationService {
  constructor(
    private readonly i18n: I18nRequestScopeService,
    @Inject(REQUEST) private req: any,
  ) {}

  /// this method for translating response msgs . its located in i18n/**/messages.json
  async translateMsg(msgCode: string): Promise<string> {
    return await this.i18n.translate(`msgs.${msgCode}`, {
      lang: this.req.i18nLang,
    });
  }

  /// this method for translating response msgs . its located in i18n/**/errors.json
  async translateErr(msgCode: string): Promise<string> {
    return await this.i18n.translate(`errors.${msgCode}`, {
      lang: this.req.i18nLang,
    });
  }
}
