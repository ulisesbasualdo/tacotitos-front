import { Component } from '@angular/core';

@Component({
  selector: 'app-vcard, ui-vcard',
  standalone: true,
  imports: [],
  styles: `
    .card {
      display: flex;
      flex-direction: row;
      height: 200px;
      background-color: #f0f0f0;
      border-radius: 10px;
      padding: 1em;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      gap: 1em;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      position: relative;
    }
    .card > * {
      flex: 1 1 auto; /* Allow items to grow and shrink */
      margin: 0.5em; /* Add some space between items */
    }
  `,
  host: {
    class: 'card',
  },
  template: `
    <div class="card">
      <ng-content />
    </div>
  `,
})
export class UIVCardComponent {}
