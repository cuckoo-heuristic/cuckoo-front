import { Component, inject, OnInit } from '@angular/core';
import { SocketService } from '@core/service/socket.service';
import { ButtonModule } from 'primeng/button';
import { io } from 'socket.io-client';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SimulateService } from '@core/service/simulate.service';

@Component({
  selector: 'lib-simulation',
  imports: [
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
  ],
  templateUrl: './simulation.html',
  styleUrl: './simulation.scss',
})
export class Simulation implements OnInit {
  private socketService = inject(SocketService);
  private simulateService = inject(SimulateService);

  ngOnInit() {}

  simulate() {
    this.simulateService.startSimulate().subscribe((res) => {});
  }
}
