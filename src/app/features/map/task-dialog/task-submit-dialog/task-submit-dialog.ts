import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SettingService } from '@core/service/setting.service';
import { TaskService } from '@core/service/task.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-task-submit-dialog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    InputGroupAddonModule,
    InputGroupModule,
    ButtonModule,
  ],
  templateUrl: './task-submit-dialog.html',
  styleUrl: './task-submit-dialog.scss',
})
export class TaskSubmitDialog implements OnInit {
  private taskService = inject(TaskService);
  private destroyRef = inject(DestroyRef);
  private settingService = inject(SettingService);
  public ref = inject(DynamicDialogRef);
  private messageService = inject(MessageService);

  submitLoading: boolean = false;

  taskForm = new FormGroup({
    name: new FormControl(null),
    cpu_computation: new FormControl(null),
    deadline: new FormControl(null),
    repeat_time: new FormControl(),
    data_size: new FormControl(null),
  });

  ngOnInit(): void {
    this.taskForm.get('repeat_time').disable();
  }

  submit() {
    const data = {
      name: this.taskForm.value.name,
      cpu_computation: this.taskForm.value.cpu_computation,
      deadline: this.taskForm.value.deadline,
      repeat_time: this.taskForm.value.repeat_time,
      data_size: this.taskForm.value.data_size,
    };

    this.taskService.createTask(data).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Message',
        detail: 'Update Setting Was Successful',
      });

      this.ref.close('submit');
      this.submitLoading = false;
    });
  }
}
