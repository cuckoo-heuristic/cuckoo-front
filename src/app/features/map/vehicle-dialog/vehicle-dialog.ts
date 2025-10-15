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
import { VehicleService } from '@core/service/vehicle.service';

@Component({
  selector: 'app-vehicle-dialog',
  imports: [
    TableComponent,
    TableActionDirective,
    ButtonModule,
    PopoverModule,
    CommonModule,
    ConfirmDialogModule,
  ],
  templateUrl: './vehicle-dialog.html',
  styleUrl: './vehicle-dialog.scss',
})
export class VehicleDialog {
  private destroyRef = inject(DestroyRef);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private mapService = inject(MapService);
  private vehicleService = inject(VehicleService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

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
      key: 'bandwidth',
      title: 'Bandwidth',
      type: 'text',
      isSort: true,
    },
    {
      key: 'cpu_capacity',
      title: 'Cpu Capacity',
      type: 'text',
      isSort: true,
    },
    {
      key: 'cache_capacity',
      title: 'Cache Capacity',
      type: 'text',
      isSort: true,
    },

    {
      key: 'transmission_power',
      title: 'Transmission Power',
      type: 'text',
      isSort: true,
    },

    {
      key: 'range',
      title: 'Range',
      type: 'text',
      isSort: true,
      action(item) {
        return item.range + 'm';
      },
    },
  ];

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.loading = true;
    this.vehicleService
      .getList()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: any) => {
        this.list = response;
        this.loading = false;
      });
  }

  viewVehcileAction(position: [number, number][]) {
    this.mapService.flyToLocationVehicle(position);
    this.ref.close();
  }

  removeAction(id: number) {
    this.confirmationService.confirm({
      message: 'Are You Sure?',
      header: 'Remove Vehicle',
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
    this.vehicleService
      .deleteVehicle(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Message',
            detail: 'Remove Was Successful',
          });
        }
      });

    this.mapService.removeVehicle(id.toString());

    this.ref.close();
  }
}
