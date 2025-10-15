import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDialog } from './vehicle-dialog';

describe('VehicleDialog', () => {
  let component: VehicleDialog;
  let fixture: ComponentFixture<VehicleDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
