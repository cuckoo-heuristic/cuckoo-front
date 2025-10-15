import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'widget-page-header',
  imports: [CommonModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  @Input() title: string;
  @Input() titleUrl: string;
  @Input() subTitle: string = '';

  router = inject(Router);

  navigateTo() {
    if (this.titleUrl) this.router.navigate([this.titleUrl]);
  }
}
