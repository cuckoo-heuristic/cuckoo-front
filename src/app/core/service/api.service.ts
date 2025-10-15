import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { convertParamsToString } from '../utils/convert-params-to-string';
import { MessageService } from 'primeng/api';
import { API_URL } from '../constants/api-routes';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);
  private apiUrl = API_URL;

  get<ResponseType>(options: {
    route: string;
    params?: object;
    ignoreFinalSlash?: boolean;
  }): Observable<ResponseType> {
    const slash = options.ignoreFinalSlash ? '' : '/';
    const url = options.params
      ? `${this.apiUrl}/${options.route + slash}?${convertParamsToString(
          options.params
        )}`
      : `${this.apiUrl}/${options.route + slash}`;
    return this.http
      .get<ResponseType>(url, httpOptions)
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  getById<ResponseType>(options: {
    route: string;
    id: string | number;
  }): Observable<ResponseType> {
    const url = `${this.apiUrl}/${options.route}/${options.id}/`;
    return this.http
      .get<ResponseType>(url, httpOptions)
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  post<ResponseType, EntityType>(options: {
    route: string;
    body?: EntityType;
    ignoreFinalSlash?: boolean;
  }): Observable<ResponseType> {
    const url = options.ignoreFinalSlash
      ? `${this.apiUrl}/${options.route}`
      : `${this.apiUrl}/${options.route}/`;
    return this.http
      .post<ResponseType>(url, options.body ?? undefined, httpOptions)
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  postFormdata(options: { route: string; body: FormData }): Observable<any> {
    const url = `${this.apiUrl}/${options.route}/`;
    return this.http
      .post<any>(url, options.body)
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  patch<ResponseType, EntityType>(options: {
    route: string;
    id: string | number | undefined;
    body: EntityType;
  }): Observable<ResponseType> {
    const url = options.id
      ? `${this.apiUrl}/${options.route}/${options.id}/`
      : `${this.apiUrl}/${options.route}/`;
    return this.http
      .patch<ResponseType>(url, options.body, httpOptions)
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  patchFormdata<ResponseType>(options: {
    route: string;
    id: string | number | undefined;
    body: FormData;
  }): Observable<ResponseType> {
    const url = options.id
      ? `${this.apiUrl}/${options.route}/${options.id}/`
      : `${this.apiUrl}/${options.route}/`;
    return this.http
      .patch<ResponseType>(url, options.body)
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  put<ResponseType, EntityType>(options: {
    route: string;
    id?: string | number | undefined;
    body: EntityType;
  }): Observable<ResponseType> {
    const url = `${this.apiUrl}/${options.route}/${
      options.id ? options.id + '' : ''
    }`;
    return this.http
      .put<ResponseType>(url, options.body)
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  putFormData<ResponseType>(options: {
    route: string;
    id: string | number | undefined;
    body: FormData;
  }): Observable<ResponseType> {
    const url = options.id
      ? `${this.apiUrl}/${options.route}/${options.id}/`
      : `${this.apiUrl}/${options.route}/`;
    return this.http
      .put<ResponseType>(url, options.body)
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  downloadFile(options: { route: string; params?: object }) {
    const url = options.params
      ? `${this.apiUrl}/${options.route}?${convertParamsToString(
          options.params
        )}`
      : `${this.apiUrl}/${options.route}`;

    return this.http
      .get(url, {
        headers: httpOptions.headers,
        responseType: 'blob',
      })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  delete<ResponseType>(options: {
    route: string;
    id: string | number;
  }): Observable<ResponseType> {
    const url = `${this.apiUrl}/${options.route}/${options.id}/`;
    return this.http
      .delete<ResponseType>(url, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          return {
            result: null,
            message: '',
            statusCode: response.status,
            success: response.ok ? true : false,
          };
        }),
        catchError(this.errorHandler.bind(this))
      );
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(1, error);
    if (error.status !== 401) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error.messages,
      });

      return of({
        result: null,
        message: error.error.messages,
        statusCode: error.status,
        success: error.ok,
      });
    } else {
      return of({
        result: null,
        message: 'Token expired',
        statusCode: error.status,
        success: error.ok,
      });
    }
  }
}
