import * as moment from 'moment';

class CacheObject {
  constructor(data: any, expireDate: Date) {
    this.expireDate = expireDate;
    this.data = data;
  }
  public data: any;
  public expireDate: Date;
}

class AppCache {
  static _cache: any = {};
  public static add(key: string, data: CacheObject): void {
    AppCache._cache[key] = data;
  }

  public static get(key: string, seconds: number, cb: any): any {
    if (
      AppCache._cache[key] &&
      AppCache._cache[key].expireDate > moment.utc().toDate()
    ) {
      return AppCache._cache[key].data;
    } else {
      const data = cb();
      const cacheObj = new CacheObject(
        data,
        moment.utc().add(seconds, 's').toDate(),
      );
      AppCache.add(key, cacheObj);
      return cacheObj;
    }
  }

  public static async getAsync(
    key: string,
    seconds: number,
    cb: any,
  ): Promise<any> {
    if (
      AppCache._cache[key] &&
      AppCache._cache[key].expireDate > moment.utc().toDate()
    ) {
      return AppCache._cache[key].data;
    } else {
      const data = await cb();
      const cacheObj = new CacheObject(
        data,
        moment.utc().add(seconds, 's').toDate(),
      );
      AppCache.add(key, cacheObj);
      return cacheObj.data;
    }
  }

  public static clear(): void {
    AppCache._cache = {};
  }

  public static getCache(): any {
    return AppCache._cache;
  }
}

export { CacheObject, AppCache };
