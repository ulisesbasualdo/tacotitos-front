// filepath: src/app/ui/resources/svg-pen/svg-pen.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-svg-pen',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      role="img"
      [attr.aria-disabled]="disabled()"
      [style.color]="disabled() ? '#bdbdbd' : '#1976d2'">
      <path
        fill="currentColor"
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z
           M20.71 7.04a1.003 1.003 0 0 0 0-1.41l-2.34-2.34
           a1.003 1.003 0 0 0-1.41 0l-1.83 1.83 3.75 3.75
           1.83-1.83z" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
      }
      :host([aria-disabled='true']) {
        cursor: not-allowed;
      }
    `,
  ],
})
export class SvgPenComponent {
  /** whether the icon is disabled */
  disabled = input<boolean>(false);
}
