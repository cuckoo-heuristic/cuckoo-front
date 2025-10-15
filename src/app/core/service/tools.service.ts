import { effect, inject, Injectable, signal } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { MapService } from './map.service';

@Injectable({ providedIn: 'root' })
export class ToolsService {
  private mapService = inject(MapService);

  currentMode = signal<'vehicle' | 'unselect' | 'rsu' | null>('unselect');
  points = signal<[number, number][]>([]);
  map: maplibregl.Map | null = null;

  constructor() {
    effect(() => {
      const m = this.mapService.map();
      if (m && !this.map) {
        this.map = m;
        this.setMap();
      }
    });
  }

  setMap() {
    if (!this.map) return;
    this.map.on('click', (e) => this.onMapClick(e.lngLat));
  }

  updateFeatureType(mode: 'vehicle' | 'rsu' | 'unselect' | null) {
    if (this.currentMode() == 'rsu') {
      this.mapService.removeRsu('bufferAdd');
    } else if (this.currentMode() == 'vehicle') {
      this.mapService.removeVehicle('vehicleAdd');
    } else if (this.currentMode() == 'unselect') {
      this.mapService.removeVehicle('vehicleAdd');
      this.mapService.removeRsu('bufferAdd');
    }
    this.points.set([]);
    this.currentMode.set(mode);
  }

  private onMapClick(lngLat: maplibregl.LngLat) {
    const mode = this.currentMode();
    if (!mode || mode === 'unselect') return;

    const coords: [number, number] = [lngLat.lng, lngLat.lat];

    if (mode === 'vehicle' && this.points().length < 2) {
      this.points.update((prev) => [...prev, coords]);
    } else if (mode === 'rsu' && this.points().length < 1) {
      this.points.update((prev) => [...prev, coords]);
    }
  }
}
