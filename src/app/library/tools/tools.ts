import { Component, DestroyRef, inject, model, OnInit } from '@angular/core';
import { ToolsService } from '@core/service/tools.service';
import { MenuItem } from 'primeng/api';
import { SpeedDial } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';
import { Button, ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RsuDialog } from '@features/map/rsu-dialog/rsu-dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MapService } from '@core/service/map.service';
import { VehicleDialog } from '@features/map/vehicle-dialog/vehicle-dialog';
import { TaskDialog } from '@features/map/task-dialog/task-dialog';
import { SettingDialog } from '@features/map/setting-dialog/setting-dialog';

@Component({
  selector: 'lib-tools',
  imports: [SpeedDial, ToastModule, Button, ButtonModule],
  templateUrl: './tools.html',
  styleUrl: './tools.scss',
})
export class Tools implements OnInit {
  private toolsService = inject(ToolsService);
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private mapService = inject(MapService);

  loading = true;
  searchValue = undefined;
  ref: DynamicDialogRef | undefined;

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Vehicle',
        icon: 'pi pi-car',
        command: () => {
          this.toolsService.updateFeatureType('vehicle');
        },
      },
      {
        label: 'RSU',
        icon: 'pi pi-wifi',
        command: () => {
          this.toolsService.updateFeatureType('rsu');
        },
      },
      {
        label: 'Unselect',
        icon: 'pi pi-times',
        command: () => {
          this.toolsService.updateFeatureType('unselect');
        },
      },
    ];
  }

  rsuListAction() {
    this.ref = this.dialogService.open(RsuDialog, {
      header: 'RSU LIST',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 1000000,
      closable: true,
      dismissableMask: false,
      modal: true,
      inputValues: {
        data: this.mapService.rsuArray(),
      },
    });

    this.ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  vehicleListAction() {
    this.ref = this.dialogService.open(VehicleDialog, {
      header: 'VEHICLE LIST',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 1000000,
      closable: true,
      dismissableMask: false,
      modal: true,
      inputValues: {
        data: this.mapService.vehicleArray(),
      },
    });

    this.ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  taskListAction() {
    this.ref = this.dialogService.open(TaskDialog, {
      header: 'TASK LIST',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 1000000,
      closable: true,
      dismissableMask: false,
      modal: true,
      inputValues: {
        data: this.mapService.vehicleArray(),
      },
    });

    this.ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  settingAction() {
    this.ref = this.dialogService.open(SettingDialog, {
      header: 'SIMULATE SETTING',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 1000000,
      closable: true,
      dismissableMask: false,
      modal: true,
    });

    this.ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
