import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  input,
  computed,
  signal,
  effect,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { UiTabDirective } from './ui-tab.directive';
import { NgTemplateOutlet } from '@angular/common';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-ui-tabs-group, ui-tabs-group',
  imports: [NgTemplateOutlet],
  template: `
    <div
      class="tabs-header"
      [class.minimalist]="hasStyleMinimalist()"
      [class.modern]="hasStyleModern()"
      [class.with-transition-move]="hasFocusIndicator()"
      #tabsHeader>
      @if (hasFocusIndicator()) {
        <div
          class="focus-indicator"
          [style.transform]="'translateX(' + focusIndicatorPosition() + 'px)'"
          [style.width]="focusIndicatorWidth() + 'px'"></div>
      }
      @for (tab of tabs.toArray(); track $index; let i = $index) {
        <button
          class="tab-button"
          [class.tab-active]="i === selectedIndex"
          [class.tab-transition]="tabBtnTransition()"
          (click)="selectTab(i)"
          #tabButton>
          {{ tab.label }}
        </button>
      }
    </div>
    <div class="tabs-content">
      @if (tabs && tabs.length > 0) {
        @defer (when true) {
          <ng-container
            *ngTemplateOutlet="
              tabs.toArray()[selectedIndex]?.templateRef
            "></ng-container>
        } @placeholder {
          <div style="min-height: 40px;">Cargando...</div>
        }
      }
    </div>
  `,
  styles: `
    .tabs-header {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      width: max-content;
      position: relative;
    }
    .tab-button {
      border-radius: 0;
      background: none;
      color: #222;
      border: 1px solid #ccc;
      border-bottom: none;
      margin-bottom: -1px;
      font-weight: 500;
      min-width: 90px;
      padding: 10px 16px;
      cursor: pointer;
      font-family: 'Zain', sans-serif;
      transition:
        background 0.3s,
        color 0.3s,
        border-bottom-color 0.3s;

      &.tab-active {
        background: #fff;
        color: #1976d2;
        border-bottom: 2px solid #1976d2;
        font-weight: bold;
        z-index: 2;
      }

      &:not(.tab-active) {
        background: none;
        color: #222;
        border-bottom: 2px solid transparent;
      }

      &:hover {
        background: #f5f5f5;
        color: #1976d2;
      }
    }

    .tab-transition {
      transition:
        background 0.3s,
        color 0.3s,
        border-bottom-color 0.3s !important;
    }

    .tabs-content {
      padding: 8px;
      border: 1px solid #eee;
    }
    .tabs-header.minimalist {
      background-color: #f0f0f0;
      border-radius: 8px;

      .focus-indicator {
        background-color: #1976d2;
        border-radius: 6px;
      }
    }
    .tabs-header.modern {
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .focus-indicator {
        background: linear-gradient(135deg, #1976d2, #42a5f5);
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
      }
    }

    .tabs-header.with-transition-move {
      .tab-button.tab-active {
        background: transparent;
        border-bottom: none;
        color: #fff;
        z-index: 3;
      }
    }

    .focus-indicator {
      position: absolute;
      height: calc(100% - 4px);
      background-color: #1976d2;
      border-radius: 4px;
      transition:
        transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1),
        width 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
      z-index: 1;
      top: 2px;
      left: 0;
      will-change: transform, width;
    }
  `,
})
export class UiTabsGroupComponent implements AfterContentInit, AfterViewInit {
  @ContentChildren(UiTabDirective) tabs!: QueryList<UiTabDirective>;
  @ViewChild('tabsHeader') tabsHeaderRef!: ElementRef<HTMLDivElement>;

  private readonly _selectedIndex = signal(0);
  get selectedIndex() {
    return this._selectedIndex();
  }

  private readonly _tabBtnTransition = signal(false);
  public tabBtnTransition = this._tabBtnTransition.asReadonly();

  private readonly _focusIndicatorPosition = signal(0);
  public focusIndicatorPosition = this._focusIndicatorPosition.asReadonly();

  private readonly _focusIndicatorWidth = signal(0);
  public focusIndicatorWidth = this._focusIndicatorWidth.asReadonly();

  public styleMinimalist = input<BooleanInput>(false);
  protected hasStyleMinimalist = computed(() =>
    coerceBooleanProperty(this.styleMinimalist())
  );

  public styleModern = input<BooleanInput>(false);
  protected hasStyleModern = computed(() =>
    coerceBooleanProperty(this.styleModern())
  );

  public withFocusIndicator = input<BooleanInput>(false);
  protected hasFocusIndicator = computed(() =>
    coerceBooleanProperty(this.withFocusIndicator())
  );

  constructor() {
    // Effect para manejar transiciones de botones
    effect(() => {
      const index = this._selectedIndex();
      if (index !== undefined) {
        this._tabBtnTransition.set(true);
        setTimeout(() => this._tabBtnTransition.set(false), 350);
      }
    });

    // Effect separado para actualizar el indicador de foco
    effect(() => {
      this._selectedIndex(); // Trigger cuando cambia selectedIndex
      const hasTransition = this.hasFocusIndicator();

      if (hasTransition && this.tabsHeaderRef) {
        // Usar setTimeout para asegurar que el DOM esté actualizado
        setTimeout(() => this.updateFocusIndicator(), 0);
      }
    });
  }

  ngAfterContentInit() {
    this._selectedIndex.set(0);
  }

  ngAfterViewInit() {
    // Inicializar el indicador de foco después de que la vista esté lista
    if (this.hasFocusIndicator()) {
      setTimeout(() => this.updateFocusIndicator(), 100);
    }
  }

  selectTab(idx: number) {
    this._selectedIndex.set(idx);
  }

  private updateFocusIndicator() {
    if (!this.tabsHeaderRef?.nativeElement || !this.hasFocusIndicator()) {
      return;
    }

    const tabButtons =
      this.tabsHeaderRef.nativeElement.querySelectorAll('.tab-button');
    const selectedButton = tabButtons[this.selectedIndex] as HTMLElement;

    if (selectedButton) {
      const headerElement = this.tabsHeaderRef.nativeElement;
      const headerRect = headerElement.getBoundingClientRect();
      const buttonRect = selectedButton.getBoundingClientRect();

      // Calcular posición relativa al contenedor padre
      const position = buttonRect.left - headerRect.left;
      const width = buttonRect.width;

      // Actualizar los signals
      this._focusIndicatorPosition.set(position);
      this._focusIndicatorWidth.set(width);
    }
  }
}
