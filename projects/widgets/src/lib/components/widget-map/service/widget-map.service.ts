import { Injectable } from '@angular/core';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';

@Injectable({
  providedIn: 'root'
})
export class WidgetMapService {

  constructor() { }

  registerProjs() {
    proj4.defs(
      'EPSG:32638',
      '+proj=utm +zone=38 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
    );
    proj4.defs(
      'EPSG:32639',
      '+proj=utm +zone=39 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
    );
    proj4.defs(
      'EPSG:32640',
      '+proj=utm +zone=40 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
    );
    proj4.defs('EPSG:32641', '+proj=utm +zone=41 +datum=WGS84 +units=m +no_defs');
    proj4.defs(
      'EPSG:2015',
      '+proj=tmerc +lat_0=0 +lon_0=-76.5 +k=0.9999 +x_0=304800 +y_0=0 +ellps=clrk66 +units=m +no_defs '
    );

    register(proj4 as any);
  }
}
