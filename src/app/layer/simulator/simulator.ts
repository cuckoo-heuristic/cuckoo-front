import { Component, effect, inject } from '@angular/core';
import { Map } from '@features/map/map';
import { Location } from '@app/library/location/location';
import { TimeAndTemp } from '@app/library/time-and-temp/time-and-temp';
import { Tools } from '@app/library/tools/tools';
import { Simulation } from '@app/library/simulation/simulation';
import { AddFeature } from '@features/add-feature/add-feature';
import { ToolsService } from '@core/service/tools.service';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-simulator',
  imports: [
    Map,
    Location,
    TimeAndTemp,
    Tools,
    Simulation,
    AddFeature,
    ImageModule,
  ],
  templateUrl: './simulator.html',
  styleUrl: './simulator.scss',
})
export class Simulator {
  displayAddFeature: boolean = false;

  private toolsService = inject(ToolsService);

  constructor() {
    effect(() => {
      const mode = this.toolsService.currentMode();
      this.displayAddFeature = mode === 'vehicle' || mode === 'rsu';
    });
  }
}
