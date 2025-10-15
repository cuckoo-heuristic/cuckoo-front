import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsuDialog } from './rsu-dialog';

describe('RsuDialog', () => {
  let component: RsuDialog;
  let fixture: ComponentFixture<RsuDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RsuDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RsuDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
