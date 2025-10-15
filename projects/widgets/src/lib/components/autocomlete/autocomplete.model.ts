import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export interface AutoCompleteModel extends AutoCompleteMethods {
    id: string;
    isSearchOffline: boolean;
    control: FormControl;
    isListOffline: boolean;
    toggleAll: boolean;
    multiple: boolean;
    isDisabled: boolean;
    keyLabel: string;
    keyValue: string;
    model: any[];
    placeHolder: string;
    filter: AutoCompleteFilter;
    service: AutoCompleteService
}

export interface AutoCompleteMethods {
    filterList(options: any): void;
    // getApiRequest(): Observable<any>;
    setOnlineList(response): any[];
};

export interface AutoCompleteService {
    getList: (param?: any) => Observable<any>;
}

export interface AutoCompleteFilter {
    search: string;
    limit: number;
    offset: number;
}