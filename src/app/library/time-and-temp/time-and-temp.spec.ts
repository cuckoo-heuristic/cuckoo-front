import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeAndTemp } from './time-and-temp';

describe('TimeAndTemp', () => {
  let component: TimeAndTemp;
  let fixture: ComponentFixture<TimeAndTemp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeAndTemp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeAndTemp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
