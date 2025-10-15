import { TestBed } from '@angular/core/testing';

import { WidgetMapService } from './widget-map.service';

describe('WidgetMapService', () => {
  let service: WidgetMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
