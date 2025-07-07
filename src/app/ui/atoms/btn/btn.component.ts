import { Component, input } from '@angular/core';
import { SvgTimesComponent } from '../../resources/svg-times/svg-times.component';
import { SvgPenComponent } from '../../resources/svg-pen/svg-pen.component';
import { SvgTrashComponent } from '../../resources/svg-trash/svg-trash.component';
import { SvgPlusComponent } from '../../resources/svg-plus/svg-plus.component';
import { SvgSaveComponent } from '../../resources/svg-save/svg-save.component';

type ButtonColor = 'blue' | 'red' | 'green' | 'bgGrayTxtBlue' | 'default';

@Component({
  selector: 'app-btn, ui-btn',
  imports: [
    SvgTimesComponent,
    SvgPenComponent,
    SvgTrashComponent,
    SvgPlusComponent,
    SvgSaveComponent,
  ],
  template: `
    <button
      [class]="color()"
      [class.btn-sm]="size() === 'small'"
      [class.btn-lg]="size() === 'large'"
      [class.blue]="color() === 'blue'"
      [class.red]="color() === 'red'"
      [class.green]="color() === 'green'"
      [class.disabled]="disabled()"
      [disabled]="disabled()"
      [class.has-icon]="icon()">
      @if (text()) {
        {{ text() }}
      }
      @if (icon()) {
        @switch (icon()) {
          @case ('times') {
            <app-svg-times [disabled]="disabled()" />
          }
          @case ('pen') {
            <app-svg-pen [disabled]="disabled()" />
          }
          @case ('trash') {
            <app-svg-trash [disabled]="disabled()" />
          }
          @case ('save') {
            <app-svg-save [disabled]="disabled()" />
          }
          @case ('plus') {
            <app-svg-plus [disabled]="disabled()" />
          }
        }
      }
    </button>
  `,
  styles: `
    button {
      border: none;
      border-radius: 15px;
      padding: 10px 20px;
      cursor: pointer;
      font-weight: 600;
      transition:
        background-color 0.3s ease,
        color 0.3s ease;
      &.disabled {
        cursor: not-allowed;
        background-color: #f8f9fa;
        color: #6c757d;
        border: none;
      }
      &.has-icon {
        padding: 5px 10px;
      }
    }
    .blue {
      background-color: #007bff;
      color: white;
      &:hover {
        background-color: #0056b3;
      }
    }
    .red {
      background-color: #dc3545;
      color: white;
      &:hover {
        background-color: #c82333;
      }
    }
    .green {
      background-color: #28a745;
      color: white;
      &:hover {
        background-color: #218838;
      }
    }
    .bgGrayTxtBlue {
      background-color: #f0f0f0;
      color: #007bff;
      border: 2px solid #007bff;
      &:hover {
        background-color: #e2e6ea;
      }
    }
    .default {
      background-color: #f8f9fa;
      color: #212529;
      &:hover {
        background-color: #e2e6ea;
      }
    }
  `,
})
export class BtnComponent {
  public text = input<string | null>(null);
  public color = input<ButtonColor>('default');
  public size = input<string>('default');
  public disabled = input<boolean>(false);
  public icon = input<'times' | 'trash' | 'pen' | 'plus' | 'save' | null>(null);
}
