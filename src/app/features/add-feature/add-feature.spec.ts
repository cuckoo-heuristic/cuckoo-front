import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeature } from './add-feature';

describe('AddFeature', () => {
  let component: AddFeature;
  let fixture: ComponentFixture<AddFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFeature);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
