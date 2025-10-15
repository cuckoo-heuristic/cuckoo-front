import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWidgetHeaderComponent } from './table-widget-header.component';

describe('TableWidgetHeaderComponent', () => {
  let component: TableWidgetHeaderComponent;
  let fixture: ComponentFixture<TableWidgetHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWidgetHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableWidgetHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
