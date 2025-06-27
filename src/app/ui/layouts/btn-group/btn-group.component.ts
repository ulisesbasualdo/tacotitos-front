import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-btn-group, ui-btn-group-layout',
  imports: [],
  template: `
    <div class="btn-group-default" [class]="align() + ' ' + gapSize()">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    .btn-group-default {
      display: flex;
      margin-top: 5px;
    }
    .right {
      justify-content: flex-end;
    }
    .left {
      justify-content: flex-start;
    }
    .center {
      justify-content: center;
    }
    .gap-small {
      gap: 5px;
    }
    .gap-large {
      gap: 10px;
    }
    .gap-extra-large {
      gap: 25px;
    }
  `,
})
export class UIBtnGroupLayoutComponent {
  public align = input<'left' | 'right' | 'center'>('left');
  public gap = input<'small' | 'large' | 'extra-large'>('large');
  public gapSize = computed(() => {
    switch (this.gap()) {
      case 'small':
        return 'gap-small';
      case 'large':
        return 'gap-large';
      case 'extra-large':
        return 'gap-extra-large';
      default:
        return 'gap-large';
    }
  });
}
