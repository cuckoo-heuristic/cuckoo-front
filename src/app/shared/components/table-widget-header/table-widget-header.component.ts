import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-table-widget-header',
  imports: [
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './table-widget-header.component.html',
  styleUrl: './table-widget-header.component.scss',
})
export class TableWidgetHeaderComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  @Input() defaultHeaderIcon: string;
  @Input() defaultHeaderLabel: string;
  @Input() defaultHeaderPlaceholder: string = 'Search...';
  @Input() defaulButtonDisplay: boolean = true;

  @Output() search = new EventEmitter();
  @Output() defaulButtonFunction = new EventEmitter();

  @ViewChild('searchElement') searchElement!: ElementRef;

  isOpen = false;

  searchInput = new FormControl('');

  emitDefaulButtonFunction() {
    this.defaulButtonFunction.emit();
  }

  ngOnInit() {
    this.searchInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((query: string) => {
        this.search.emit(query);
      });
  }

  toggleSearchInput() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchElement.nativeElement.focus();
    }
  }
}
