import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@core/models/response.model';
import { ApiService } from '@core/service/api.service';
import { environment } from '@env/environment';
import { GeoLatLon } from '../location/location.model';

@Injectable({ providedIn: 'root' })
export class TimeAndTempService {
  private apiService = inject(ApiService);
  _apiUrl = 'location';

  time = signal(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date())
  );
  temp = signal<number>(38);

  constructor() {
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    let date = new Date();
    let formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    this.time.set(formatter.format(date));
  }

  getWeather(params: GeoLatLon) {
    return this.apiService.post<ApiResponse<any>, any>({
      route: `${this._apiUrl}/weather`,
      body: params,
      ignoreFinalSlash: true,
    });
  }
}
