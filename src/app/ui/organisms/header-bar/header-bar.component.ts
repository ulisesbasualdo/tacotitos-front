import { Component, input, output } from '@angular/core';

export interface IMenuItem {
  id: number;
  label: string;
  action: () => void;
}

@Component({
  selector: 'app-header-bar, ui-header-bar',
  imports: [],
  template: `
    <div class="header-bar">
      <div class="header-bar__title">
        <h1>{{ barTitle() }}</h1>
      </div>
      @if (menuItems() && menuItems().length > 0) {
        <div class="header-bar__actions">
          @for (item of menuItems(); track item.id) {
            <button
              class="header-bar__action"
              [disabled]="!item.action"
              (click)="item.action()">
              {{ item.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .header-bar {
      position: sticky;
      top: 5px;
      z-index: 1000;
      width: 100%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      background-color: #3c9eff;
      font-family: 'Zain', sans-serif;
      border-radius: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      margin-bottom: 20px;
    }
    .header-bar__actions {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
    }
    .header-bar__title {
      padding: 12px 16px;
      color: white;
    }
    .header-bar__action {
      color: white;
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 8px 12px;
      transition: color 0.3s ease;
    }
    .header-bar__action:hover {
      color: #f0f0f0;
    }
    .header-bar__action:focus {
      outline: none;
    }
    .header-bar__action:disabled {
      color: #6c757d;
      cursor: not-allowed;
    }
  `,
})
export class UIHeaderBarComponent {
  public barTitle = input<string>('');
  public menuItems = input<IMenuItem[]>([]);

  protected actionClick = output<number>();

  protected onActionClick(actionId: number) {
    this.actionClick.emit(actionId);
  }
}
