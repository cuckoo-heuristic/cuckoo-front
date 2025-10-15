import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { TimeAndTempService } from './time-and-temp.service';
import { GeoLatLon } from '../location/location.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleService } from '@core/service/vehicle.service';

@Component({
  selector: 'lib-time-and-temp',
  imports: [],
  templateUrl: './time-and-temp.html',
  styleUrl: './time-and-temp.scss',
})
export class TimeAndTemp {
  private timeAndTempService = inject(TimeAndTempService);
  private vehicleService = inject(VehicleService);
  private destroyRef = inject(DestroyRef);

  time = this.timeAndTempService.time();
  temp = null;
  mouseLatLon = this.vehicleService.mouselatlon();

  constructor() {
    effect(() => {
      this.time = this.timeAndTempService.time();
    });

    effect(() => {
      this.getTemp(this.vehicleService.geoLatLon());
    });

    effect(() => {
      this.mouseLatLon = this.vehicleService.mouselatlon();
    });
  }

  getTemp(geo: GeoLatLon) {
    this.timeAndTempService
      .getWeather(geo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: any) => {
        if (response.current_weather) {
        }
        this.temp = `${response.current_weather.temperature}
          ${response.current_weather_units.temperature}`;
      });
  }
}
