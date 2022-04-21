import { Inject, Injectable } from '@angular/core';

import { CookieService } from './cookie.service';
import { CookieOptionsProvider } from './cookie-options-provider';
import { CookieOptions } from './cookie-options.model';
import { NgxRequest, NgxResponse } from './tokens';

@Injectable()
export class CookieBackendService extends CookieService {
  constructor(
    @Inject(NgxRequest) private request: any,
    @Inject(NgxResponse) private response: any,
    _optionsProvider: CookieOptionsProvider,
  ) {
    super(_optionsProvider);
  }

  protected override get cookieString(): string {
    return this.request.cookie || this.request.headers['cookie'] || '';
  }

  protected override set cookieString(val: string) {
    this.request.cookie = val;
    this.response.cookie = val;
  }

  overrideput(key: string, value: string, options: CookieOptions = {}): void {
    let findKey = false;
    let newCookie = Object.keys(this.getAll())
      // tslint:disable-next-line: no-shadowed-variable
      .map((keyItem) => {
        if (keyItem === key) {
          findKey = true;
          return `${key}=${value}`;
        }
        return `${keyItem}=${this.get(keyItem)}`;
      })
      .join('; ');
    if (!findKey) {
      newCookie += `; ${key}=${value}`;
    }
    this.request.headers.cookie = newCookie;
    // not sure
    this.cookieString = newCookie;
  }

  override remove(key: string, options?: CookieOptions): void {
    const newCookie = Object.keys(this.getAll())
      // tslint:disable-next-line: no-shadowed-variable
      .map((keyItem) => {
        if (keyItem === key) {
          return '';
        }
        return `${keyItem}=${this.get(keyItem)}`;
      })
      .join('; ');
    this.request.headers.cookie = newCookie;
    // not sure
    this.cookieString = newCookie;
  }
}
