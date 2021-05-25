import { Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
export default class FireBase {
  public async getFirebaseDynamicLink(recoveryToken: string, email: string) {
    return axios.post(
      'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA-HrLLRVEdatU_-ebXzHu7XyFWe6qAqhc',
      {
        dynamicLinkInfo: {
          domainUriPrefix: 'https://imaginativenews.page.link',
          link: `https://imaginativenews.page.link/forgot-password?token=${recoveryToken}&email=${email}`,
          androidInfo: {
            androidPackageName: 'com.imaginative_news.imaginative_news',
          },
          iosInfo: { iosBundleId: 'com.imaginative-news.imaginative-news' },
        },
      },
    );
  }
}
