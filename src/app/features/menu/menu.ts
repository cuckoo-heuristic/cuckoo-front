import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { SvgWidget } from '@component/svg-widget/svg-widget';

@Component({
  selector: 'app-menu',
  imports: [FormsModule, SelectButton, SvgWidget],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class MenuComponent {
  states: any[] = [
    { src: '/icon/tools.svg', value: 'tools' },
    { src: '/icon/tools.svg', value: 'simulate' },
    { src: '/icon/tools.svg', value: 'export' },
  ];

  value: string = 'off';
}
