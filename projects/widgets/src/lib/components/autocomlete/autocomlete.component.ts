import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ContentChild,
  DestroyRef,
  Input,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { CheckboxModule } from "primeng/checkbox";
import { ChipModule } from "primeng/chip";
import { FloatLabelModule } from "primeng/floatlabel";
import { MultiSelectModule } from "primeng/multiselect";
import { AutocompleteItemDirective } from "./autocomplete-item.directive";
import { AutoCompleteMethods, AutoCompleteService } from "./autocomplete.model";
@Component({
  selector: "widget-autocomlete",
  imports: [
    CommonModule,
    MultiSelectModule,
    FloatLabelModule,
    CheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    ChipModule,
  ],
  templateUrl: "./autocomlete.component.html",
  styleUrl: "./autocomlete.component.scss",
})
export class AutocomleteComponent implements OnInit, AfterViewInit {
  @Input({
    required: true,
  })
  dataList: AutoCompleteService | any[];
  @Input({
    required: true,
  })
  control: FormControl;
  @Input() id = (Math.random() * 1000).toString();
  @Input() isSearchOffline = false;
  @Input() toggleAll = false;
  @Input() multiple = true;
  @Input() isDisabled = false;
  @Input() keyLabel = "first_name";
  @Input() keyValue = "value";
  @Input() keyApiRequest = "getByParams";
  @Input() model = [];
  @Input() placeHolder = "";
  @Input() methods: Partial<AutoCompleteMethods>;
  @Input() filter = {
    search: "",
    limit: 100,
    offset: 0,
  };

  @ContentChild(AutocompleteItemDirective)
  autocompleteItemDirective!: AutocompleteItemDirective;

  list: any[];
  originalList: any[];
  loading = false;

  constructor(private destroyRef: DestroyRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.checkTypeGetList();
  }

  checkTypeGetList() {
    if (this.dataList instanceof Array) {
      this.createOfflineOriginalList();
    } else {
      this.getListOnline();
    }
  }

  getList() {
    if (!this.isSearchOffline) {
      this.getListOnline();
    }
  }

  filterList(options, mode: "dropdown" | "complete" | "keyUp") {
    if (mode == "keyUp") {
      if (options.code == "Backspace" && !options.target.value) {
        options.query = "";
      } else {
        return;
      }
    } else {
      if (
        (this.filter.search && !options.query && mode == "complete") ||
        !options.query
      ) {
        this.list = [...this.originalList];
        return;
      }
    }
    const method = this.checkMethods("filterList");
    if (method) {
      this.filter = {
        ...this.filter,
        ...method(options),
      };
    } else {
      this.filter.search = options.query;
    }
    this.getList();
  }

  // onSelectAllChange(event) {
  //   this.control.setValue(
  //     event.checked ? [...this.listView.visibleOptions()] : []
  //   );
  // }

  getListOnline() {
    this.loading = true;
    this.getApiRequest()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        if (response.success) {
          const method = this.checkMethods("setOnlineList");
          if (method) {
            this.setList(method(response));
          } else {
            this.setList(response.result.results);
          }
          this.addValuesToList();
        } else {
          this.setList([]);
        }
        this.loading = false;
      });
  }

  getApiRequest() {
    return (this.dataList as AutoCompleteService)[this.keyApiRequest](
      this.filter
    );
  }

  createOfflineOriginalList() {
    this.loading = true;
    this.setList(this.dataList as any[]);
    this.addValuesToList();
    this.loading = false;
  }

  addValuesToList() {
    const list = [...this.originalList];
    this.model.forEach((item) => {
      if (!list.find((data) => data[this.keyValue] == item[this.keyValue])) {
        list.push(item);
      }
    });
    this.setList(list);
  }

  checkMethods(key: keyof AutoCompleteMethods) {
    if (this.methods?.[key]) {
      return this.methods[key.toString()];
    }
    return false;
  }

  setList(data: any[]) {
    this.originalList = [...data];
    this.list = [...this.originalList];
  }

  removeItem(value) {
    const index = this.control.value.findIndex(
      (item) => item[this.keyValue] === value[this.keyValue]
    );
    if (index > -1) this.control.value.splice(index, 1);
    this.control["_updateValue"]();
  }
}
