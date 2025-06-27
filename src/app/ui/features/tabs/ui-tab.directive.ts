import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appUiTab], [uiTab]',
})
export class UiTabDirective {
  @Input('uiTab') label!: string;
  constructor(public templateRef: TemplateRef<any>) {}
}
