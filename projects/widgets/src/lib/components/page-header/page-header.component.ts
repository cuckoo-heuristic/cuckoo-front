import { Component, inject, Input, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-header',
  imports: [
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
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
