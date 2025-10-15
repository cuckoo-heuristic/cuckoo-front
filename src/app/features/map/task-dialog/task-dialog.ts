import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { TableComponent } from 'projects/widgets/src/public-api';
import { WidgetTableColumnConfig } from '@core/models/widget-table.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableActionDirective } from 'projects/widgets/src/lib/components/table/directives/table-action.directive';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { MapService } from '@core/service/map.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TaskService } from '@core/service/task.service';
import { TableWidgetHeaderComponent } from '@component/table-widget-header/table-widget-header.component';
import { TaskSubmitDialog } from './task-submit-dialog/task-submit-dialog';

@Component({
  selector: 'app-task-dialog',
  imports: [
    TableComponent,
    TableActionDirective,
    ButtonModule,
    PopoverModule,
    CommonModule,
    ConfirmDialogModule,
    TableWidgetHeaderComponent,
  ],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.scss',
})
export class TaskDialog {
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private mapService = inject(MapService);
  private taskService = inject(TaskService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private dialogService = inject(DialogService);

  @Input() data;

  searchValue = undefined;
  list: [];
  loading: boolean = false;

  columns: WidgetTableColumnConfig[] = [
    {
      key: 'name',
      title: 'Name',
      type: 'text',
      isSort: true,
    },
    {
      key: 'deadline',
      title: 'Deadline',
      type: 'text',
      isSort: true,
      action(item) {
        return `${item.deadline}s`;
      },
    },
    {
      key: 'data_size',
      title: 'Data Size',
      type: 'text',
      isSort: true,
      action(item) {
        return `${item.data_size}MB`;
      },
    },
    {
      key: 'cpu_computation',
      title: 'CPU Computation',
      type: 'text',
    },
  ];

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.loading = true;
    this.taskService
      .getList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: any) => {
        this.list = response;
        this.loading = false;
      });
  }

  viewTaskAction(position: [number, number], range) {
    this.ref.close();
  }

  removeAction(id: number) {
    this.confirmationService.confirm({
      message: 'Are You Sure?',
      header: 'Remove Task',
      rejectButtonProps: {
        label: 'Back',
        severity: 'contrast',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Remove',
        severity: 'danger',
        iconPos: 'right',
        icon: 'pi pi-trash',
      },
      accept: () => {
        this.remove(id);
      },
      key: 'dialog',
    });
  }

  remove(id: number) {
    this.taskService
      .deleteTask(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Message',
            detail: 'Remove Was Successful',
          });

          this.getList();
        }
      });
  }

  addTask() {
    this.ref = this.dialogService.open(TaskSubmitDialog, {
      header: 'ADD TASK',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 1000000,
      closable: true,
      dismissableMask: false,
      modal: true,
      inputValues: {
        data: this.mapService.vehicleArray(),
      },
    });

    this.ref.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        if (data == 'submit') {
          this.getList();
        }
      });
  }

  editAction(data) {}
}
