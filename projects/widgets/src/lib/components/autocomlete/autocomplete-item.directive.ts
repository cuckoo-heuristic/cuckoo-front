import { Directive, TemplateRef } from "@angular/core";
import { NgModel } from "@angular/forms";

@Directive({
  selector: "[auto-item]",
  providers: [NgModel],
})
export class AutocompleteItemDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
