import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderConfigComponent } from './form-builder-config.component';

describe('FormBuilderConfigComponent', () => {
  let component: FormBuilderConfigComponent;
  let fixture: ComponentFixture<FormBuilderConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBuilderConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBuilderConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
