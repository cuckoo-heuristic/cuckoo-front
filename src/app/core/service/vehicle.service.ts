import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@core/models/response.model';
import { ApiService } from '@core/service/api.service';
import { GeoAngle, GeoLatLon } from '../../library/location/location.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private apiService = inject(ApiService);

  _apiUrl = 'vehicle';

  geoLatLon = signal<GeoLatLon>({
    lat: environment.latlon.lat,
    lon: environment.latlon.lon,
  });
  geoAngle = signal<GeoAngle>({ angle: 0 });
  mouselatlon = signal({ lat: 0, lon: 0 });
  pointOne = signal({ lat: 0, lon: 0 });
  pointTwo = signal({ lat: 0, lon: 0 });
  featureData = signal(null);

  updateGeoLatLon(newData: GeoLatLon) {
    this.geoLatLon.set(newData);
  }

  updateGeoAngle(newData: number) {
    this.geoAngle.set({ angle: newData });
  }

  mouseLocation(latlon) {
    this.mouselatlon.set(latlon);
  }

  getDirection(startAt: [number, number], endAt: [number, number]) {
    console.log(startAt, endAt);

    const origin = encodeURIComponent(`${startAt[1]},${startAt[0]}`);
    const destination = encodeURIComponent(`${endAt[1]},${endAt[0]}`);

    return this.apiService.get<ApiResponse<any>>({
      route: `${this._apiUrl}/direction?origin=${origin}&destination=${destination}`,
      ignoreFinalSlash: true,
    });
  }

  extractRoutePoints(data: any) {
    const points: [number, number][] = [];

    if (!data.routes) return points;

    data.routes.forEach((route: any) => {
      if (route.overview_polyline?.points) {
        points.push(...this.decodePolyline(route.overview_polyline.points));
      }

      route.legs?.forEach((leg: any) => {
        leg.steps?.forEach((step: any) => {
          if (step.polyline) {
            points.push(...this.decodePolyline(step.polyline));
          }
        });
      });
    });

    return points;
  }

  decodePolyline(encoded: string) {
    let index = 0,
      lat = 0,
      lng = 0,
      coordinates: [number, number][] = [];

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      coordinates.push([lng / 1e5, lat / 1e5]);
    }

    return coordinates;
  }

  createVehicle(body) {
    return this.apiService.post<ApiResponse<any>, any>({
      route: `${this._apiUrl}`,
      body: body,
    });
  }

  deleteVehicle(id: number) {
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
