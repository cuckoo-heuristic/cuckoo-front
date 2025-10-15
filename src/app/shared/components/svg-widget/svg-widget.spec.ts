import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgWidget } from './svg-widget';

describe('SvgWidget', () => {
  let component: SvgWidget;
  let fixture: ComponentFixture<SvgWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
