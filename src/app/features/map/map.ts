import { Component, effect, inject, OnInit } from '@angular/core';
import { VehicleService } from '@core/service/vehicle.service';
import { environment } from '@env/environment';
import maplibregl from 'maplibre-gl';
import polyline from '@mapbox/polyline';
import * as turf from '@turf/turf';
import { MapService } from '@core/service/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss'],
})
export class Map implements OnInit {
  private vehicleService = inject(VehicleService);
  private mapService = inject(MapService);

  map;

  rsuArray = [];
  selectedVehicle;
  vehicleArray = [];

  constructor() {
    effect(() => {
      this.rsuArray = this.mapService.rsuArray();
      console.log(this.rsuArray);

      if (this.map.isStyleLoaded()) {
        this.renderRsu(this.map);
      }
    });

    effect(() => {
      this.vehicleArray = this.mapService.vehicleArray();
      console.log(this.vehicleArray);

      if (this.map.isStyleLoaded()) {
        this.renderVehicles(this.map);
      }
    });
  }

  ngOnInit() {
    this.map = new maplibregl.Map({
      container: 'map',
      style:
        'https://api.maptiler.com/maps/streets/style.json?key=oiggPBCLaeRRUZ5DYCL4',
      // 'https://api.maptiler.com/maps/0198414d-44bd-7e72-bb80-89e13485aea0/style.json?key=oiggPBCLaeRRUZ5DYCL4',

      center: [environment.latlon.lon, environment.latlon.lat],
      zoom: 17,
      pitch: 60,
      bearing: -80,
    });

    let timeoutId: any;

    this.map.on('move', () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const center = this.map.getCenter();
        this.vehicleService.updateGeoLatLon({
          lat: center.lat,
          lon: center.lng,
        });
      }, 1000);
    });

    this.map.on('rotate', () => {
      this.vehicleService.updateGeoAngle(this.map.getBearing());
    });

    this.map.on('load', () => {
      this.map.getStyle().layers.forEach((layer) => {
        if (layer.type === 'symbol') {
          this.map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });

      this.map.getStyle().layers.forEach((layer) => {
        if (
          layer['source-layer'] &&
          layer['source-layer'].includes('transportation')
        ) {
          if (layer.type === 'line') {
            this.map.setPaintProperty(layer.id, 'line-color', '#B5BFD1');
          }
        }
      });

      this.map.getStyle().layers.forEach((layer) => {
        if (
          layer['source-layer']?.includes('water') ||
          layer['source-layer']?.includes('ocean') ||
          layer['source-layer']?.includes('river') ||
          layer['source-layer']?.includes('lake')
        ) {
          this.map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });

      this.map.setPaintProperty('background', 'background-color', '#F7F6F6');
      this.map.getStyle().layers.forEach((layer) => {
        if (layer['source-layer'] && layer['source-layer'].includes('land')) {
          if (layer.type === 'fill') {
            this.map.setPaintProperty(layer.id, 'fill-color', '#F7F6F6');
          }
        }
      });

      this.map.setLight({
        anchor: 'viewport',
        color: '#ffffff',
        intensity: 0.2,
        position: [1.15, 200, 50],
      });

      this.map.addLayer({
        id: '3d-buildings',
        source: 'openmaptiles',
        'source-layer': 'building',
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['get', 'render_height'],
            0,
            '#E9EAEE',
            100,
            '#C4C6CB',
          ],
          'fill-extrusion-height': [
            'coalesce',
            ['get', 'render_height'],
            ['*', ['get', 'levels'], 6],
          ],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 1,
        },
      });

      this.map.on('mousemove', (e) => {
        const lat = e.lngLat.lat ? e.lngLat.lat : 0;
        const lon = e.lngLat.lng ? e.lngLat.lng : 0;
        this.vehicleService.mouseLocation({ lat: lat, lon: lon });
      });
    });

    this.map.on('load', () => {
      this.renderRsu(this.map);
      this.renderVehicles(this.map);
      this.mapService.map.set(this.map);
    });
  }

  private renderRsu(map: maplibregl.Map) {
    this.rsuArray.forEach((buf) => {
      let { position, id, range } = buf;
      const radius = range;

      const circle = turf.circle(position, radius, {
        steps: 64,
        units: 'meters',
      });

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

      if (map.getSource(id)) {
        (map.getSource(id) as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource(id, { type: 'geojson', data: geojson });

        map.addLayer({
          id: `${id}-point-layer`,
          type: 'circle',
          source: id,
          filter: ['==', '$type', 'Point'],
          paint: {
            'circle-radius': 6,
            'circle-color': '#007AFF',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#C5EBFE',
          },
        });

        map.addLayer({
          id: `${id}-buffer-layer`,
          type: 'fill',
          source: id,
          filter: ['==', '$type', 'Polygon'],
          paint: {
            'fill-color': '#1689FE',
            'fill-opacity': 0.1,
          },
        });

        map.addLayer({
          id: `${id}-buffer-outline`,
          type: 'line',
          source: id,
          filter: ['==', '$type', 'Polygon'],
          paint: {
            'line-color': '#1689FE',
            'line-opacity': 0.5,
            'line-width': 2,
          },
        });
      }
    });
  }

  private renderVehicles(map: maplibregl.Map) {
    let vehiclesToRender = [];
    if (this.selectedVehicle) {
      // اگر یک وسیله نقلیه انتخاب شده باشد، فقط همان را نمایش بده
      vehiclesToRender.push(this.selectedVehicle);
    } else {
      // در غیر این صورت، تمام وسایل نقلیه را نمایش بده
      vehiclesToRender = this.vehicleArray;
    }

    vehiclesToRender.forEach((vehicle) => {
      const { id, paths, status } = vehicle;

      if (!paths || paths.length < 2) return;

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

      if (map.getSource(id)) {
        (map.getSource(id) as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource(id, {
          type: 'geojson',
          data: geojson,
          lineMetrics: true,
        });

        const lineLayerId = `${id}-line`;
        const startLayerId = `${id}-start-point`;
        const endLayerId = `${id}-end-point`;

        map.addLayer({
          id: lineLayerId,
          type: 'line',
          source: id,

          filter: ['==', '$type', 'LineString'],
          paint: {
            'line-width': 8,
            'line-opacity': 0.75,
            'line-gradient': [
              'interpolate',
              ['linear'],
              ['line-progress'],
              0,
              '#F530A9',
              1,
              '#AC2AF7',
            ],
          },
        });

        map.addLayer({
          id: startLayerId,
          type: 'circle',
          source: id,
          filter: ['==', ['get', 'role'], 'start'],
          paint: {
            'circle-radius': 5,
            'circle-color': '#9EEA37',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#F530A9',
          },
        });

        map.addLayer({
          id: endLayerId,
          type: 'circle',
          source: id,
          filter: ['==', ['get', 'role'], 'end'],
          paint: {
            'circle-radius': 3,
            'circle-color': '#AC2AF7',
            'circle-stroke-width': 3,
            'circle-stroke-color': '#AC2AF7',
          },
        });

        [lineLayerId, startLayerId, endLayerId].forEach((layerId) => {
          map.on('click', layerId, (e) => {
            if (e.features && e.features.length) {
              console.log('Clicked Vehicle feature:', e.features[0]);
              this.selectedVehicle = vehicle;
            }
          });

          map.on(
            'mouseenter',
            layerId,
            () => (map.getCanvas().style.cursor = 'pointer')
          );
          map.on(
            'mouseleave',
            layerId,
            () => (map.getCanvas().style.cursor = '')
          );
        });
      }
    });
  }
}
