import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@core/models/response.model';
import { ApiService } from '@core/service/api.service';

@Injectable({ providedIn: 'root' })
export class RsuService {
  private apiService = inject(ApiService);

  _apiUrl = 'rsu';

  createRsu(body) {
    return this.apiService.post<ApiResponse<any>, any>({
      route: `${this._apiUrl}`,
      body: body,
    });
  }

  deleteRsu(id: number) {
    return this.apiService.delete<ApiResponse<any>>({
      route: this._apiUrl,
      id,
    });
  }

  getList() {
    return this.apiService.get<ApiResponse<any>>({
      route: this._apiUrl,
    });
  }
}
