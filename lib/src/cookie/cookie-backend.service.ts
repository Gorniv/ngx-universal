import { Inject, Injectable } from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { CookieService } from './cookie.service';
import { CookieOptionsProvider } from './cookie-options-provider';
import { CookieOptions } from './cookie-options.model';

@Injectable()
export class CookieBackendService extends CookieService {
  constructor(
    @Inject(REQUEST) private request: any,
    @Inject(RESPONSE) private response: any,
    _optionsProvider: CookieOptionsProvider,
  ) {
    super(_optionsProvider);
  }

  protected get cookieString(): string {
    return this.request.cookie || this.request.headers['cookie'] || '';
  }

  protected set cookieString(val: string) {
    this.request.cookie = val;
    this.response.cookie = val;
  }

  put(key: string, value: string, options: CookieOptions = {}): void {
    this.getAll()[key] = value;
    const newCookie = Object.keys(this.getAll())
      // tslint:disable-next-line: no-shadowed-variable
      .map((key) => {
        return `${key}=${this.get(key)}`;
      })
      .join('; ');
    this.request.headers.cookie = newCookie;
    // not sure
    this.cookieString = newCookie;
  }
}
