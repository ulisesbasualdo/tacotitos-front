import { Component, input } from '@angular/core';

@Component({
  selector: 'app-svg-check',
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
        d="M9 16.2l-3.5-3.5a1 1 0 0 1 1.4-1.4l2.8 2.8 7.3-7.3a1 1 0 0 1 1.4 1.4l-8 8a1 1 0 0 1-1.4 0z" />
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
export class SvgCheckComponent {
  /** whether the icon is disabled */
  disabled = input<boolean>(false);
}
