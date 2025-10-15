import { Directive, TemplateRef } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[detail]',
  providers: [NgModel],
})
export class TableDetailDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
