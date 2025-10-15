import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'svg-widget',
  imports: [],
  templateUrl: './svg-widget.html',
  styleUrl: './svg-widget.scss',
})
export class SvgWidget implements OnInit {
  @Input() src: string = '';
  @Input() color: string = 'white';
  @Input() width: number = 24;
  @Input() height: number = 24;
  style: string = '';

  ngOnInit(): void {
    this.style = `background-image: url("${this.src}"); background-repeat: no-repeat; width:${this.width}px; height:${this.width}px;  background-size: ${this.width}px ${this.width}px; color:${this.color};`;
  }
}
