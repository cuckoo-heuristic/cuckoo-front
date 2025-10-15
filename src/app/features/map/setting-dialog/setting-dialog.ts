import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SettingService } from '@core/service/setting.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-setting-dialog',
  imports: [
    FormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './setting-dialog.html',
  styleUrl: './setting-dialog.scss',
})
export class SettingDialog implements OnInit {
  loading: boolean = false;

  private destroyRef = inject(DestroyRef);
  private settingService = inject(SettingService);
  public ref = inject(DynamicDialogRef);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.get();
  }

  settingForm = new FormGroup({
    simulateTime: new FormControl(null),
    refreshTime: new FormControl(null),
  });

  update() {
    this.loading = true;

    const body = {
      refresh_data_time: Number(this.settingForm.value.refreshTime),
      simulate_time: Number(this.settingForm.value.simulateTime),
    };

    this.settingService
      .update(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Message',
          detail: 'Update Setting Was Successful',
        });

        this.ref.close();
        this.loading = false;
      });
  }

  get() {
    this.settingService
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.settingForm.get('refreshTime').setValue(res['refresh_data_time']);
        this.settingForm.get('simulateTime').setValue(res['simulate_time']);
      });
  }
}
