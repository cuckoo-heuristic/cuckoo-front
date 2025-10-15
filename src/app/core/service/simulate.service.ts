import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@core/models/response.model';
import { ApiService } from '@core/service/api.service';
import { MapService } from './map.service';

@Injectable({ providedIn: 'root' })
export class SimulateService {
  private apiService = inject(ApiService);
  private mapService = inject(MapService);

  _apiUrl = 'simulate';

  startSimulate() {
    this.mapService.addAnimatedMarker();

    return this.apiService.post<ApiResponse<any>, any>({
      route: `${this._apiUrl}`,
    });
  }
}
