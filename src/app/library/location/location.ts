import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { VehicleService } from '@core/service/vehicle.service';
import { GeoLatLon } from './location.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SvgWidget } from '@component/svg-widget/svg-widget';
import { LocationService } from '@core/service/location.service';

@Component({
  selector: 'lib-location',
  imports: [SvgWidget],
  templateUrl: './location.html',
  styleUrls: ['./location.scss'],
})
export class Location {
  private vehicleService = inject(VehicleService);
  private locationService = inject(LocationService);
  private destroyRef = inject(DestroyRef);

  city: string = 'Tehran';
  area: string = 'Iran';
  road: string = 'Sattar Khan Street';
  angle: number = 0;

  constructor() {
    effect(() => {
      this.getAdders(this.vehicleService.geoLatLon());
    });

    effect(() => {
      this.angle = this.vehicleService.geoAngle().angle;
    });
  }

  getAdders(geo: GeoLatLon) {
    this.locationService
      .getLocation(geo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: any) => {
        this.city = response.address?.city;
        this.area = response.address?.country;
        this.road = response.address?.road;
      });
  }
}
