import { Component, input } from '@angular/core';

@Component({
  selector: 'app-svg-plus',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      role="img"
      [attr.aria-disabled]="disabled()"
      [style.color]="disabled() ? '#bdbdbd' : '#4caf50'">
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round" />
      <line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round" />
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
export class SvgPlusComponent {
  disabled = input<boolean>(false);
}
