import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[header]',
  standalone: true,
})
export class TableHeaderDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
