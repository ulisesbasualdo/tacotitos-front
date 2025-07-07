// filepath: src/app/ui/resources/svg-trash/svg-trash.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-svg-trash',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      role="img"
      [attr.aria-disabled]="disabled()"
      [style.color]="disabled() ? '#bdbdbd' : '#212121'">
      <!-- tapa del tacho -->
      <path
        d="M8 6V4h8v2"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round" />
      <!-- línea superior -->
      <path
        d="M3 6h18"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round" />
      <!-- cuerpo del tacho -->
      <rect
        x="5"
        y="6"
        width="14"
        height="14"
        stroke="currentColor"
        stroke-width="2"
        fill="none" />
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
export class SvgTrashComponent {
  /** Si true, deshabilita el icono y cambia su color */
  disabled = input<boolean>(false);
}
