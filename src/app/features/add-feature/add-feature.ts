import { Component, effect, inject, model, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToolsService } from '@core/service/tools.service';
import { VehicleService } from '@core/service/vehicle.service';
import { RsuService } from '@core/service/rsu.service';
import { MapService } from '@core/service/map.service';

@Component({
  selector: 'app-add-feature',
  imports: [
    FormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    InputGroupAddonModule,
    InputGroupModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-feature.html',
  styleUrl: './add-feature.scss',
})
export class AddFeature implements OnInit {
  private toolsService = inject(ToolsService);
  private vehicleService = inject(VehicleService);
  private mapService = inject(MapService);
  private rsuService = inject(RsuService);

  submitLoading: boolean = false;

  vehicleForm = new FormGroup({
    latStartAt: new FormControl(null),
    lonStartAt: new FormControl(null),
    latEndAt: new FormControl(null),
    lonEndAt: new FormControl(null),
    name: new FormControl(null),
    frequency: new FormControl(null),
    power: new FormControl(null),
    bandwidth: new FormControl(null),
    cache: new FormControl(null),
    range: new FormControl(null),
  });

  rsuForm = new FormGroup({
    latAt: new FormControl(null),
    lonAt: new FormControl(null),
    bandwidth: new FormControl(null),
    frequency: new FormControl(null),
    power: new FormControl(null),
    cache: new FormControl(null),
    range: new FormControl(null),
  });

  featureType;
  featureData;

  constructor() {
    effect(() => {
      this.featureType = this.toolsService.currentMode();
      if (this.featureType === 'rsu') {
        this.rsuForm.reset();
      } else if (this.featureType === 'vehicle') {
        this.vehicleForm.reset();
      } else if (this.featureType === 'unselect') {
        this.vehicleForm.reset();
        this.rsuForm.reset();
      }
    });

    effect(() => {
      this.featureType = this.toolsService.currentMode();
    });

    effect(() => {
      const pts = this.toolsService.points();

      if (this.featureType === 'rsu') {
        if (pts.length > 0) {
          this.rsuForm.get('latAt')?.setValue(pts[0][0]);
          this.rsuForm.get('lonAt')?.setValue(pts[0][1]);
          this.mapService.addRsuSignal.update((prev) => ({
            ...prev,
            position: pts[0],
          }));
        }
      } else if (this.featureType === 'vehicle') {
        if (pts.length > 0) {
          this.vehicleForm.get('latStartAt')?.setValue(pts[0][1]);
          this.vehicleForm.get('lonStartAt')?.setValue(pts[0][0]);
        }
        if (pts.length > 1) {
          this.vehicleForm.get('latEndAt')?.setValue(pts[1][1]);
          this.vehicleForm.get('lonEndAt')?.setValue(pts[1][0]);

          this.vehicleService
            .getDirection([pts[0][0], pts[0][1]], [pts[1][0], pts[1][1]])
            .subscribe((response: any) => {
              this.mapService.addVehicleSignal.set({ paths: response });
            });
        }
      }
    });
  }

  ngOnInit(): void {
    this.rsuForm.valueChanges.subscribe((val) => {
      this.mapService.addRsuSignal.update((prev) => ({
        position: [val.latAt, val.lonAt],
        range: val.range,
      }));
    });
  }

  submit() {
    this.submitLoading = true;

    if (this.featureType == 'vehicle') {
      const data = {
        name: this.vehicleForm.value.name,
        paths: this.mapService.addVehicleSignal().paths,
        power: this.vehicleForm.value.power,
        frequency: this.vehicleForm.value.frequency,
        bandwidth: this.vehicleForm.value.bandwidth,
        cache: this.vehicleForm.value.cache,
        range: this.vehicleForm.value.range,
      };

      this.vehicleService.createVehicle(data).subscribe((res) => {
        this.mapService.addVehicleSignal.set({
          paths: undefined,
        });
        this.vehicleForm.reset();
        this.toolsService.points.set([]);
        this.toolsService.updateFeatureType('unselect');
        this.submitLoading = false;
      });
    } else if (this.featureType == 'rsu') {
      const data = {
        position: [this.rsuForm.value.lonAt, this.rsuForm.value.latAt],
        power: this.rsuForm.value.power,
        frequency: this.rsuForm.value.frequency,
        bandwidth: this.rsuForm.value.bandwidth,
        cache: this.rsuForm.value.cache,
        range: this.rsuForm.value.range,
      };

      this.rsuService.createRsu(data).subscribe((res: any) => {
        this.mapService.addRsuSignal.set({
          position: undefined,
          range: 20,
        });
        this.rsuForm.reset();
        this.toolsService.points.set([]);
        this.toolsService.updateFeatureType('unselect');
        this.submitLoading = false;
      });
    }
  }
}
