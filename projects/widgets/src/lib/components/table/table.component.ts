import {
  Component,
  ContentChild,
  ContentChildren,
  effect,
  EventEmitter,
  inject,
  Input,
  model,
  Output,
  QueryList,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WidgetTableColumnConfig } from '@core/models/widget-table.model';
import { TableActionDirective } from './directives/table-action.directive';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { TableHeaderDirective } from './directives/table-header.directive';

@Component({
  selector: 'widget-table',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() pageNumber: number = 0;
  @Input() rowNumber: number = 7;
  @Input() showHeader: boolean = false;
  @Input() showRowIndex: boolean = false;
  @Input() defaultSearchFunction: (query) => void;
  @Input() defaultHeaderIcon: string = 'pi pi-plus';
  @Input() defaultHeaderLabel: string = 'Add';
  @Input() defaultHeaderPlaceholder: string = 'Search...';
  @Input() maxHeight: number = 77;
  @Input() enableCheckbox: boolean = false;
  @Input() columnsConfig: WidgetTableColumnConfig[] = [];
  @Input() dataList = [];
  @Input() totalCount: number;
  @Input() loading: boolean;
  @Input() paginator: boolean = true;
  @Input() isLazy: boolean = true;
  @Input() titleTranslator: boolean = true;
  @Input() defaulButtonDisplay: boolean = true;
  selectedItems = model<any[]>([]);
  @Input() hasDefaultSearch: boolean = true;
  @Input() hasDefaultButton: boolean = true;

  @Output() searchByQuery = new EventEmitter();
  @Output() defaulButtonFunction = new EventEmitter();
  @Output() onPageChange = new EventEmitter();

  @ContentChild(TableHeaderDirective)
  tableHeaderDirective!: TableHeaderDirective;
  @ContentChildren(TableActionDirective)
  tableActionDirective!: QueryList<TableActionDirective>;

  searchInput = new FormControl('');

  search(query: string) {
    this.searchByQuery.emit(query);
  }

  emitDefaulButtonFunction() {
    this.defaulButtonFunction.emit();
  }

  emitPageChange(id) {
    this.onPageChange.emit(id);
  }
}
