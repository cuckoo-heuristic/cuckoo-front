import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  private mapService = inject(MapService);

  constructor() {
    this.connect();
  }

  private connect() {
    this.socket = io('http://localhost:3000');

    this.socket.on('vehicleArrayInit', (data) => {
      this.mapService.vehicleArray.set(data);
    });

    this.socket.on('rsuArrayInit', (data) => {
      this.mapService.rsuArray.set(data);
    });

    this.socket.on('vehicleUpdate', (data) => {
      console.log(data);

      // this.mapService.rsuArray.set(data);
    });
  }
}
