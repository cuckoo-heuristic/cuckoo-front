import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSubmitDialog } from './task-submit-dialog';

describe('TaskSubmitDialog', () => {
  let component: TaskSubmitDialog;
  let fixture: ComponentFixture<TaskSubmitDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSubmitDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskSubmitDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
