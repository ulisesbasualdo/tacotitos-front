import { Directive, TemplateRef, input } from '@angular/core';

@Directive({
  selector: '[appSimplmeTab], [simpleTab]',
})
export class SimpleTabDirective {
  label = input.required<string>({ alias: 'simpleTab' });

  constructor(public templateRef: TemplateRef<any>) {}
}
