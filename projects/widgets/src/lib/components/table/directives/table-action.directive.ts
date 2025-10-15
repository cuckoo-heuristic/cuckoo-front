import { Directive, TemplateRef } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[action]',
  providers: [NgModel],
})
export class TableActionDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
