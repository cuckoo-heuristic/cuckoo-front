import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@core/models/response.model';
import { ApiService } from '@core/service/api.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiService = inject(ApiService);

  _apiUrl = 'task';

  createTask(body) {
    return this.apiService.post<ApiResponse<any>, any>({
      route: `${this._apiUrl}`,
      body: body,
    });
  }

  deleteTask(id: number) {
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
