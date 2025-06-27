import { Component } from '@angular/core';

@Component({
  selector: 'app-vcards, ui-vcards',
  standalone: true,
  imports: [],
  styles: `
    .vcards-container {
      display: flex;
      flex-direction: row;
      height: 200px;
      width: 100%;
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
  `,
  host: {
    class: 'vcards-container',
  },
  template: `
    <ng-content />
    <!-- filtros -->
    <!-- <ng-content select="[vCardsHeader]" /> -->
    <!-- lista de cards -->
    <!-- <ng-content select="[vCard]" /> -->
    <!-- scroll -->
    <!-- <ng-content select="[vScroll]" /> -->
  `,
})
export class UIVCardsComponent {}
