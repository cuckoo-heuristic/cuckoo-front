import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingDialog } from './setting-dialog';

describe('SettingDialog', () => {
  let component: SettingDialog;
  let fixture: ComponentFixture<SettingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
