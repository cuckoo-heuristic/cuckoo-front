import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@core/models/response.model';
import { ApiService } from '@core/service/api.service';

@Injectable({ providedIn: 'root' })
export class SettingService {
  private apiService = inject(ApiService);

  _apiUrl = 'setting';

  get() {
    return this.apiService.get<ApiResponse<any>>({
      route: this._apiUrl,
    });
  }

  update(body) {
    return this.apiService.put<any, any>({
      route: this._apiUrl,
      body: body,
    });
  }
}
