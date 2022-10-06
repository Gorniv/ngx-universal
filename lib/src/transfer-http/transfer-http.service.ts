import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { TransferState, StateKey, makeStateKey } from '@angular/platform-browser';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class TransferHttpService {
  constructor(
    protected transferState: TransferState,
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  request<T>(
    method: string,
    uri: string | Request,
    options?: {
      body?: any;
      headers?:
        | HttpHeaders
        | {
        [header: string]: string | string[];
      };
      reportProgress?: boolean;
      observe?: 'response';
      params?:
        | HttpParams
        | {
        [param: string]: string | string[];
      };
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.getData<T>(method, uri, options, (method: string, uri: string | Request, options: any) => {
      return this.httpClient.request<T>(method, typeof uri === 'string' ? uri : uri.url, options);
    });
  }

  /**
   * Performs a request with `get` http method.
   */
  get<T>(
    url: string,
    options?: {
      headers?:
        | HttpHeaders
        | {
        [header: string]: string | string[];
      };
      observe?: 'response';
      params?:
        | HttpParams
        | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.getData<T>('get', url, options, (_method: string, uri: string | Request, options: any) => {
      return this.httpClient.get<T>(url, options);
    });
  }

  /**
   * Performs a request with `post` http method.
   */
  post<T>(
    url: string,
    body: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
        [header: string]: string | string[];
      };
      observe?: 'response';
      params?:
        | HttpParams
        | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.getPostData<T>(
      'post',
      url,
      body,
      options,
      (_method: string, uri: string | Request, body: any, options: any) => {
        return this.httpClient.post<T>(url, body, options);
      },
    );
  }

  /**
   * Performs a request with `put` http method.
   */
  put<T>(
    url: string,
    _body: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
        [header: string]: string | string[];
      };
      observe?: 'body';
      params?:
        | HttpParams
        | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.getPostData<T>(
      'put',
      url,
      _body,
      options,
      (_method: string, uri: string | Request, _body: any, options: any) => {
        return this.httpClient.put<T>(url, _body, options);
      },
    );
  }

  /**
   * Performs a request with `delete` http method.
   */
  delete<T>(
    url: string,
    options?: {
      headers?:
        | HttpHeaders
        | {
        [header: string]: string | string[];
      };
      observe?: 'response';
      params?:
        | HttpParams
        | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.getData<T>('delete', url, options, (_method: string, uri: string | Request, options: any) => {
      return this.httpClient.delete<T>(url, options);
    });
  }

  /**
   * Performs a request with `patch` http method.
   */
  patch<T>(
    url: string,
    body: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
        [header: string]: string | string[];
      };
      observe?: 'response';
      params?:
        | HttpParams
        | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.getPostData<T>(
      'patch',
      url,
      body,
      options,
      (_method: string, uri: string | Request, body: any, options: any): Observable<any> => {
        return this.httpClient.patch<T>(url, body, options);
      },
    );
  }

  /**
   * Performs a request with `head` http method.
   */
  head<T>(
    url: string,
    options?: {
      headers?:
        | HttpHeaders
        | {
        [header: string]: string | string[];
      };
      observe?: 'response';
      params?:
        | HttpParams
        | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.getData<T>('head', url, options, (_method: string, uri: string | Request, options: any) => {
      return this.httpClient.head<T>(url, options);
    });
  }

  /**
   * Performs a request with `options` http method.
   */
  options<T>(
    url: string,
    options?: {
      headers?:
        | HttpHeaders
        | {
        [header: string]: string | string[];
      };
      observe?: 'response';
      params?:
        | HttpParams
        | {
        [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    },
  ): Observable<T> {
    return this.getData<T>(
      'options',
      url,
      options,
      (_method: string, uri: string | Request, options: any) => {
        return this.httpClient.options<T>(url, options);
      },
    );
  }

  private getData<T>(
    method: string,
    uri: string | Request,
    options: any,
    callback: (method: string, uri: string | Request, options: any) => Observable<any>,
  ): Observable<T> {
    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const tempKey = url + (options ? JSON.stringify(options) : '');
    const key = makeStateKey<T>(tempKey);
    try {
      return this.resolveData<T>(key);
    } catch (e) {
      return callback(method, uri, options).pipe(
        tap((data: T) => {
          if (isPlatformBrowser(this.platformId)) {
            // Client only code.
            // nothing;
          }
          if (isPlatformServer(this.platformId)) {
            this.setCache<T>(key, data);
          }
        }),
      );
    }
  }

  private getPostData<T>(
    _method: string,
    uri: string | Request,
    body: any,
    options: any,
    callback: (method: string, uri: string | Request, body: any, options: any) => Observable<any>,
  ): Observable<T> {
    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const tempKey =
      url + (body ? JSON.stringify(body) : '') + (options ? JSON.stringify(options) : '');
    const key = makeStateKey<T>(tempKey);

    try {
      return this.resolveData<T>(key);
    } catch (e) {
      return callback(_method, uri, body, options).pipe(
        tap((data: T) => {
          if (isPlatformBrowser(this.platformId)) {
            // Client only code.
            // nothing;
          }
          if (isPlatformServer(this.platformId)) {
            this.setCache<T>(key, data);
          }
        }),
      );
    }
  }

  private resolveData<T>(key: StateKey<T>): Observable<T> {
    const data = this.getFromCache<T>(key);

    if (!data) {
      throw new Error();
    }

    if (isPlatformBrowser(this.platformId)) {
      // Client only code.
      this.transferState.remove(key);
    }
    if (isPlatformServer(this.platformId)) {
      // Server only code.
    }

    return from(Promise.resolve<T>(data));
  }

  private setCache<T>(key: StateKey<T>, data: T): void {
    return this.transferState.set<T>(key, data);
  }

  private getFromCache<T>(key: StateKey<T>): T | null {
    return this.transferState.get<T | null>(key, null);
  }
}
