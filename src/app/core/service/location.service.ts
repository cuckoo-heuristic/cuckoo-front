import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@core/models/response.model';
import { ApiService } from '@core/service/api.service';
import { GeoLatLon } from '../../library/location/location.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private apiService = inject(ApiService);

  _apiUrl = 'location';

  getLocation(params: GeoLatLon) {
    return this.apiService.post<ApiResponse<any>, any>({
      route: `${this._apiUrl}/reverse`,
      body: params,
      ignoreFinalSlash: true,
    });
  }
}
