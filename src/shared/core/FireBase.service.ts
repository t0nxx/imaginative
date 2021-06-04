import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { stringifyUrl } from 'query-string';
@Injectable()
export default class FireBaseService {
  private Api_key = 'AIzaSyA-HrLLRVEdatU_-ebXzHu7XyFWe6qAqhc';

  private baseUrl = 'https://imaginativenews.page.link';

  private androidPackageName = 'com.imaginative_news.imaginative_news';

  private iosBundleId = 'com.imaginative-news.imaginative-news';

  public async getFirebaseDynamicLink(
    route: string,
    params: Record<string, any>,
  ) {
    const dynamicLink = stringifyUrl({
      url: `${this.baseUrl}/${route}`,
      query: params,
    });
    const response = await axios.post(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${this.Api_key}`,
      {
        dynamicLinkInfo: {
          domainUriPrefix: this.baseUrl,
          link: dynamicLink,
          androidInfo: {
            androidPackageName: this.androidPackageName,
          },
          iosInfo: { iosBundleId: this.iosBundleId },
        },
      },
    );
    return response.data.shortLink;
  }

  // public async getFirebaseDynamicLinkOld(recoveryToken: string, email: string) {
  //   return axios.post(
  //     'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA-HrLLRVEdatU_-ebXzHu7XyFWe6qAqhc',
  //     {
  //       dynamicLinkInfo: {
  //         domainUriPrefix: 'https://imaginativenews.page.link',
  //         link: `https://imaginativenews.page.link/forgot-password?token=${recoveryToken}&email=${email}`,
  //         androidInfo: {
  //           androidPackageName: 'com.imaginative_news.imaginative_news',
  //         },
  //         iosInfo: { iosBundleId: 'com.imaginative-news.imaginative-news' },
  //       },
  //     },
  //   );
  // }
}
