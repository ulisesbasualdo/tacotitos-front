import { Component } from '@angular/core';

@Component({
  selector: 'app-main, ui-main-layout',
  imports: [],
  template: `
    <div class="main-layout">
      <ng-content select="[header]"></ng-content>
      <ng-content select="[sidebar]"></ng-content>
      <ng-content select="[content]"></ng-content>
      <ng-content select="[footer]"></ng-content>
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }
    .main-layout {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100%;
    }
  `,
})
export class UIMainLayoutComponent {}
