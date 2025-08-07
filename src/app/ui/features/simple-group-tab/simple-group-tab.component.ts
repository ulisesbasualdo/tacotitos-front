import {
  Component,
  ViewChild,
  ElementRef,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  input,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface SimpleTab {
  label: string;
  template: TemplateRef<any>;
}

@Component({
  selector: 'app-simple-group-tab',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tab-header" #tabHeader>
      <div
        class="focus-indicator"
        [style.transform]="'translateX(' + indicatorPosition() + 'px)'"
        [style.width]="indicatorWidth() + 'px'"></div>
      @for (tab of tabs(); track $index; let i = $index) {
        <button
          class="tab-btn"
          [class.active]="i === activeIndex()"
          (click)="selectTab(i)">
          {{ tab.label }}
        </button>
      }
    </div>
    <div class="tab-content">
      @if (activeTab()) {
        <ng-container *ngTemplateOutlet="activeTab()!.template"></ng-container>
      }
    </div>
  `,
  styles: `
    .tab-header {
      position: relative;
      display: flex;
      background: #f5f5f5;
      border-radius: 8px;
      padding: 4px;
    }

    .focus-indicator {
      position: absolute;
      height: calc(100% - 8px);
      background: #1976d2;
      border-radius: 6px;
      transition: all 0.3s ease;
      top: 4px;
      z-index: 1;
    }

    .tab-btn {
      background: none;
      border: none;
      padding: 12px 20px;
      cursor: pointer;
      border-radius: 6px;
      font-weight: 500;
      position: relative;
      z-index: 2;
      transition: color 0.3s ease;
    }

    .tab-btn.active {
      color: white;
    }

    .tab-content {
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-top: 8px;
      background: white;
    }
  `,
})
export class SimpleGroupTabComponent {
  @ViewChild('tabHeader') headerRef!: ElementRef<HTMLDivElement>;

  tabs = input.required<SimpleTab[]>();

  private readonly _activeIndex = signal(0);
  private readonly _indicatorPosition = signal(0);
  private readonly _indicatorWidth = signal(0);

  protected activeIndex = this._activeIndex.asReadonly();
  protected indicatorPosition = this._indicatorPosition.asReadonly();
  protected indicatorWidth = this._indicatorWidth.asReadonly();

  activeTab = computed(() => this.tabs()[this.activeIndex()] || null);

  constructor() {
    effect(() => {
      this.activeIndex();
      this.updateIndicator();
    });
  }

  selectTab(index: number) {
    this._activeIndex.set(index);
  }

  private updateIndicator() {
    if (!this.headerRef?.nativeElement) return;

    const buttons = this.headerRef.nativeElement.querySelectorAll('.tab-btn');
    const activeButton = buttons[this.activeIndex()] as HTMLElement;

    if (activeButton) {
      this._indicatorPosition.set(activeButton.offsetLeft);
      this._indicatorWidth.set(activeButton.offsetWidth);
    }
  }
}
