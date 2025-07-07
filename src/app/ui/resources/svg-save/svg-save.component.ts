import { Component, input } from '@angular/core';

@Component({
  selector: 'app-svg-save',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      role="img"
      [attr.aria-disabled]="disabled()"
      [style.color]="disabled() ? '#bdbdbd' : '#1976d2'">
      <!-- contorno del diskete -->
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        ry="2"
        stroke="currentColor"
        fill="none"
        stroke-width="2" />
      <!-- área de etiqueta -->
      <rect x="6" y="6" width="12" height="5" fill="currentColor" />
      <!-- ranura metálica -->
      <rect x="3" y="12" width="18" height="3" fill="currentColor" />
      <!-- eje/ventana circular -->
      <circle cx="12" cy="17" r="2" fill="currentColor" />
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
export class SvgSaveComponent {
  /** Si true, deshabilita el icono y cambia su color */
  disabled = input<boolean>(false);
}
