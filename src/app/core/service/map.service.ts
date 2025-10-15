import { effect, inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '@core/models/response.model';
import { ApiService } from '@core/service/api.service';
import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';

@Injectable({ providedIn: 'root' })
export class MapService {
  private apiService = inject(ApiService);

  _apiUrl = 'map';

  rsuArray = signal<any>([]);
  selectedRsu = signal(null);
  vehicleArray = signal([]);
  selectedVehicle = signal(null);
  map = signal(null);
  addRsuSignal = signal<any>({
    position: undefined,
    range: 20,
  });
  addVehicleSignal = signal<any>({
    paths: undefined,
  });

  constructor() {
    effect(() => {
      const data = this.addRsuSignal();
      if (this.map()) {
        this.addOrUpdateBuffer('bufferAdd', data);
      }
    });

    effect(() => {
      const data = this.addVehicleSignal().paths;
      if (this.map()) {
        this.addOrUpdateVehicle('vehicleAdd', data);
      }
    });
  }

  flyToLocationRsu(coords: [number, number], zoom: number) {
    const mapInstance = this.map();
    if (!mapInstance) {
      console.warn('Map is not initialized yet');
      return;
    }

    mapInstance.flyTo({
      center: [coords[1], coords[0]],
      zoom: this.mapRangeInverse(16),
      speed: 1.2,
      curve: 1.4,
      essential: true,
      pitch: 0,
      bearing: 0,
    });
  }

  flyToLocationVehicle(coords: [number, number][]) {
    const bounds = coords.reduce(
      (b, coord) => b.extend(coord as [number, number]),
      new maplibregl.LngLatBounds(
        coords[0] as [number, number],
        coords[0] as [number, number]
      )
    );
    this.map().fitBounds(bounds, { padding: 150 });
  }

  mapRangeInverse(
    input: number,
    inMin = 50,
    inMax = 2000,
    outMin = 5,
    outMax = 20
  ): number {
    return (
      outMin + ((outMax - outMin) * (inMax - input)) / (inMax - inMin) / 1.5
    );
  }

  private addOrUpdateBuffer(id: string, data) {
    const mapInstance = this.map();
    if (!mapInstance || !mapInstance.isStyleLoaded()) return;

    const { position, range = 20 } = data;

    if (!position) {
      if (mapInstance.getLayer(`${id}-point-layer`))
        mapInstance.removeLayer(`${id}-point-layer`);
      if (mapInstance.getLayer(`${id}-buffer-layer`))
        mapInstance.removeLayer(`${id}-buffer-layer`);
      if (mapInstance.getLayer(`${id}-buffer-outline`))
        mapInstance.removeLayer(`${id}-buffer-outline`);
      if (mapInstance.getSource(id)) mapInstance.removeSource(id);
      return;
    }

    const circle = turf.circle(position, range, { steps: 64, units: 'meters' });

    const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: position },
          properties: {},
        },
        {
          type: 'Feature',
          geometry: circle.geometry,
          properties: {},
        },
      ],
    };

    if (mapInstance.getSource(id)) {
      (mapInstance.getSource(id) as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      mapInstance.addSource(id, { type: 'geojson', data: geojson });

      mapInstance.addLayer({
        id: `${id}-point-layer`,
        type: 'circle',
        source: id,
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': 8,
          'circle-color': '#ff9900',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.5,
        },
      });

      mapInstance.addLayer({
        id: `${id}-buffer-layer`,
        type: 'fill',
        source: id,
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': '#ff9900',
          'fill-opacity': 0.1,
        },
      });

      mapInstance.addLayer({
        id: `${id}-buffer-outline`,
        type: 'line',
        source: id,
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'line-color': '#ff9900',
          'line-opacity': 0.5,
          'line-width': 2,
        },
      });
    }
  }

  removeRsu(id: string) {
    const layers = [
      `${id}-point-layer`,
      `${id}-buffer-layer`,
      `${id}-buffer-outline`,
    ];
    layers.forEach((layerId) => {
      if (this.map().getLayer(layerId)) {
        this.map().removeLayer(layerId);
      }
    });

    if (this.map().getSource(id)) {
      this.map().removeSource(id);
    }
  }

  private addOrUpdateVehicle(id: string, data) {
    const mapInstance = this.map();
    if (!mapInstance || !mapInstance.isStyleLoaded()) return;

    console.log(mapInstance);

    const paths = data;

    if (!paths || paths.length < 2) {
      if (mapInstance.getLayer(`${id}-line`))
        mapInstance.removeLayer(`${id}-line`);
      if (mapInstance.getLayer(`${id}-points`))
        mapInstance.removeLayer(`${id}-points`);
      if (mapInstance.getSource(id)) mapInstance.removeSource(id);
      return;
    }

    const startPoint = paths[0];
    const endPoint = paths[paths.length - 1];

    const features: GeoJSON.Feature[] = [
      {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: paths },
        properties: { status },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: startPoint },
        properties: { role: 'start' },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: endPoint },
        properties: { role: 'end' },
      },
    ];

    const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
      type: 'FeatureCollection',
      features,
    };

    if (mapInstance.getSource(id)) {
      (mapInstance.getSource(id) as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      mapInstance.addSource(id, {
        type: 'geojson',
        data: geojson,
        lineMetrics: true,
      });

      mapInstance.addLayer({
        id: `${id}-line`,
        type: 'line',
        source: id,
        filter: ['==', '$type', 'LineString'],
        paint: {
          'line-width': 8,
          'line-opacity': 1,
          'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0,
            '#FFFF00',
            1,
            '#FF6600',
          ],
        },
      });

      mapInstance.addLayer({
        id: `${id}-start-point`,
        type: 'circle',
        source: id,
        filter: ['==', ['get', 'role'], 'start'],
        paint: {
          'circle-radius': 5,
          'circle-color': '#9EEA37',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#FFFF00',
        },
      });

      mapInstance.addLayer({
        id: `${id}-end-point`,
        type: 'circle',
        source: id,
        filter: ['==', ['get', 'role'], 'end'],
        paint: {
          'circle-radius': 3,
          'circle-color': '#FF6600',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#FF6600',
        },
      });
    }

    const bounds = paths.reduce(
      (b, coord) => b.extend(coord as [number, number]),
      new maplibregl.LngLatBounds(
        paths[0] as [number, number],
        paths[0] as [number, number]
      )
    );
    mapInstance.fitBounds(bounds, { padding: 150 });
  }

  removeVehicle(id: string) {
    const mapInstance = this.map();
    if (!mapInstance) return;

    const layers =
      mapInstance
        .getStyle()
        .layers?.filter((l) => l.source === id)
        .map((l) => l.id) || [];

    layers.forEach((layerId) => {
      if (mapInstance.getLayer(layerId)) {
        mapInstance.removeLayer(layerId);
      }
    });

    if (mapInstance.getSource(id)) {
      mapInstance.removeSource(id);
    }
  }

  addAnimatedMarker(): void {
    this.vehicleArray().forEach((vehicle) => {
      // تبدیل مختصات (lat, lng) به (lng, lat)
      const lineCoordinates = vehicle.paths;
      const lineString = turf.lineString(lineCoordinates);

      // افزودن یک Source جدید برای نقطه متحرک (مارکر)
      this.map()!.addSource(`marker-${vehicle.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: lineCoordinates[0],
          },
          properties: {},
        },
      });

      // افزودن یک Layer جدید برای نمایش نقطه
      this.map()!.addLayer({
        id: `marker-${vehicle.id}`,
        type: 'circle',
        source: `marker-${vehicle.id}`,
        paint: {
          'circle-radius': 8,
          'circle-color': '#00ff00', // رنگ سبز
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 2,
        },
      });

      // شروع انیمیشن روی مسیر
      const animationDuration = 60000; // 60 ثانیه
      let startTime = 0;

      const animateMarker = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp;
        }
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);

        // استفاده از turf.js برای پیدا کردن نقطه در طول مسیر
        const totalDistance = turf.length(lineString);
        const targetDistance = totalDistance * progress;
        const currentPoint = turf.along(lineString, targetDistance, {
          units: 'kilometers',
        });

        // به‌روزرسانی داده‌های Source برای حرکت نقطه
        (
          this.map()!.getSource(
            `marker-${vehicle.id}`
          ) as maplibregl.GeoJSONSource
        ).setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: currentPoint.geometry.coordinates,
          },
          properties: {},
        });

        if (progress < 1) {
          requestAnimationFrame(animateMarker);
        }
      };

      requestAnimationFrame(animateMarker);
    });
  }
}
