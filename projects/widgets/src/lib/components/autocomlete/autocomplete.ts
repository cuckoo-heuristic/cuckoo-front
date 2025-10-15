import { FormControl } from "@angular/forms";
import { Observable, of } from "rxjs";
import {
  AutoCompleteFilter,
  AutoCompleteModel,
  AutoCompleteService,
} from "./autocomplete.model";

export class Autocomplete implements AutoCompleteModel {
  id = (Math.random() * 1000).toString();
  isSearchOffline = false;
  control: FormControl = new FormControl();
  isListOffline = false;
  toggleAll = false;
  multiple = true;
  isDisabled = false;
  keyLabel = "label";
  keyValue = "value";
  model = [];
  placeHolder = "";
  service: AutoCompleteService;
  loading = false;
  filter: AutoCompleteFilter = {
    search: "",
    limit: 100,
    offset: 0,
  };

  constructor(options: Partial<Autocomplete>) {}
  setOnlineList(response: any): any[] {
    return [];
  }

  checkTypeGetList(): void {}

  getList(): void {}

  filterList(options: any): void {}

  getListOffline(): any[] {
    return [];
  }

  getListOnline() {}

  getApiRequest(): Observable<any> {
    return of();
  }

  createOfflineOriginalList() {}

  addValuesToList() {}
}
