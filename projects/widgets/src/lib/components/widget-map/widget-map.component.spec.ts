import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMapComponent } from './widget-map.component';

describe('WidgetMapComponent', () => {
  let component: WidgetMapComponent;
  let fixture: ComponentFixture<WidgetMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
