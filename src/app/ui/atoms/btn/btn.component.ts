import { Component, input, output } from '@angular/core';

type ButtonColor = 'blue' | 'red' | 'green' | 'bgGrayTxtBlue' | 'default';

@Component({
  selector: 'app-btn, ui-btn',
  imports: [],
  template: `
    @if (text()) {
      <button
        [class]="color()"
        [class.btn-sm]="size() === 'small'"
        [class.btn-lg]="size() === 'large'"
        [class.blue]="color() === 'blue'"
        [class.red]="color() === 'red'"
        [class.green]="color() === 'green'"
        [class.disabled]="disabled()"
        [disabled]="disabled()"
        (click)="clickEvent.emit()">
        {{ text() }}
      </button>
    }
  `,
  styles: `
    button {
      border: none;
      border-radius: 15px;
      padding: 10px 20px;
      cursor: pointer;
      font-weight: 600;
      font-family: 'Zain', sans-serif;
      transition:
        background-color 0.3s ease,
        color 0.3s ease;
      &.disabled {
        cursor: not-allowed;
        background-color: #f8f9fa;
        color: #6c757d;
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
  public text = input<string>('');
  public color = input<ButtonColor>('default');
  public size = input<string>('default');
  public disabled = input<boolean>(false);
  public clickEvent = output();
}
