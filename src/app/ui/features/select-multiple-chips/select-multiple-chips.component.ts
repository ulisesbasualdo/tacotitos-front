import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  effect,
  ElementRef,
  HostListener,
  inject,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { IColleague } from '../i-colleague';
import { Mediator, IDropdownComponent } from '../mediator.class';
import { MediatorService } from '../mediator.service';

export interface ChipItem {
  id: string | number;
  label: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-select-multiple-chips',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMultipleChipsComponent),
      multi: true,
    },
  ],
  template: `
    <div class="chips-container">
      <!-- Selected chips display -->
      <div class="selected-chips" [class.empty]="selectedItems().length === 0">
        @for (item of selectedItems(); track item.id) {
          <div
            class="chip"
            [class.disabled]="item.disabled"
            [class.removing]="removingChips().has(item.id)">
            <span class="chip-label">{{ item.label }}</span>
            @if (!item.disabled && !isComponentDisabled()) {
              <button
                type="button"
                class="chip-remove"
                (click)="removeItem(item)"
                [attr.aria-label]="'Remover ' + item.label">
                ✕
              </button>
            }
          </div>
        }

        @if (selectedItems().length === 0) {
          <span class="placeholder">{{ placeholder() }}</span>
        }
      </div>

      <!-- Dropdown toggle button -->
      <button
        type="button"
        class="dropdown-toggle"
        [class.open]="isOpen()"
        [disabled]="isComponentDisabled()"
        (click)="toggleDropdown()"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="listbox">
        <svg
          class="dropdown-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <!-- Dropdown menu -->
      @if (isOpen()) {
        <div class="dropdown-menu" role="listbox">
          <!-- Search input -->
          @if (searchable()) {
            <div class="search-container">
              <input
                type="text"
                class="search-input"
                [(ngModel)]="searchTerm"
                (input)="onSearchInput($event)"
                [placeholder]="searchPlaceholder()"
                #searchInput />
              <svg
                class="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          }

          <!-- Options list -->
          <div class="options-container">
            @if (filteredOptions().length === 0) {
              <div class="no-options">{{ noOptionsText() }}</div>
            } @else {
              @for (option of filteredOptions(); track option.id) {
                <div
                  class="option"
                  [class.selected]="isSelected(option)"
                  [class.disabled]="option.disabled"
                  (click)="toggleOption(option)"
                  role="option"
                  [attr.aria-selected]="isSelected(option)">
                  <div class="option-content">
                    <span class="option-label">{{ option.label }}</span>
                  </div>

                  @if (isSelected(option)) {
                    <svg
                      class="check-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  }
                </div>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .chips-container {
      position: relative;
      display: flex;
      align-items: stretch;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
      min-height: 48px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .chips-container:focus-within {
      border-color: #3b82f6;
      box-shadow:
        0 0 0 3px rgba(59, 130, 246, 0.12),
        0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    .chips-container:hover:not(:focus-within) {
      border-color: #d1d5db;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }

    .selected-chips {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px 14px;
      align-items: flex-start;
      min-height: 32px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .selected-chips.empty {
      justify-content: flex-start;
      align-items: center;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.025em;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
      animation: chipAppear 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      transform-origin: center;
      margin: 2px 0;
    }

    @keyframes chipAppear {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(-4px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .chip.removing {
      animation: chipRemove 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
      pointer-events: none;
    }

    @keyframes chipRemove {
      0% {
        opacity: 1;
        transform: scale(1) translateY(0);
        max-width: 200px;
        margin: 2px 4px 2px 0;
        padding: 6px 12px;
      }
      25% {
        transform: scale(0.95) translateY(-2px);
        opacity: 0.8;
      }
      50% {
        transform: scale(0.9) translateY(-1px);
        opacity: 0.6;
      }
      75% {
        opacity: 0.3;
        transform: scale(0.8) translateY(2px);
        max-width: 100px;
        margin: 2px 2px 2px 0;
        padding: 6px 6px;
      }
      100% {
        opacity: 0;
        transform: scale(0.6) translateY(4px);
        max-width: 0;
        margin: 2px 0;
        padding: 6px 0;
      }
    }

    .chip:hover:not(.removing) {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
      z-index: 1;
    }

    .chip.disabled {
      background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
      cursor: not-allowed;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    /* Smooth reflow for remaining chips */
    .chip:not(.removing) {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .chip-label {
      white-space: nowrap;
      line-height: 1.2;
      display: flex;
      align-items: center;
    }

    .chip-remove {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 16px;
      padding: 0;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: bold;
      line-height: 1;
      flex-shrink: 0;
    }

    .chip-remove:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.1);
    }

    .chip-remove:active {
      transform: scale(0.95);
    }

    .placeholder {
      color: #9ca3af;
      font-size: 14px;
      font-weight: 500;
    }

    .dropdown-toggle {
      background: none;
      border: none;
      padding: 12px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #e5e7eb;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 0 12px 12px 0;
    }

    .dropdown-toggle:hover:not(:disabled) {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .dropdown-toggle:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .dropdown-icon {
      width: 20px;
      height: 20px;
      color: #6b7280;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dropdown-toggle.open .dropdown-icon {
      transform: rotate(180deg);
      color: #3b82f6;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow:
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
      z-index: 1000;
      max-height: 320px;
      overflow: hidden;
      animation: dropdownAppear 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      backdrop-filter: blur(8px);
    }

    @keyframes dropdownAppear {
      from {
        opacity: 0;
        transform: translateY(-12px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .search-container {
      position: relative;
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
      background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
    }

    .search-input {
      width: 100%;
      padding: 12px 44px 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      background: white;
      font-weight: 500;
    }

    .search-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-input::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }

    .search-icon {
      position: absolute;
      right: 28px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: #9ca3af;
      pointer-events: none;
      transition: color 0.2s ease;
    }

    .search-input:focus + .search-icon {
      color: #3b82f6;
    }

    .options-container {
      max-height: 240px;
      overflow-y: auto;
      padding: 8px 0;
    }

    .option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      cursor: pointer;
      transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      margin: 0 8px;
      border-radius: 8px;
      position: relative;
    }

    .option:hover:not(.disabled) {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      transform: translateX(4px);
    }

    .option.selected {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      color: #1d4ed8;
      font-weight: 600;
    }

    .option.selected:hover {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    }

    .option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .option-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .option-label {
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.025em;
    }

    .check-icon {
      width: 18px;
      height: 18px;
      color: #1d4ed8;
      animation: checkAppear 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes checkAppear {
      from {
        opacity: 0;
        transform: scale(0.6);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .no-options {
      padding: 24px;
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
      font-weight: 500;
    }

    /* Custom scrollbar styling */
    .options-container::-webkit-scrollbar {
      width: 8px;
    }

    .options-container::-webkit-scrollbar-track {
      background: #f9fafb;
      border-radius: 4px;
    }

    .options-container::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .options-container::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    }

    /* Enhanced focus styles for accessibility */
    .chip-remove:focus,
    .dropdown-toggle:focus,
    .search-input:focus,
    .option:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    /* Responsive design */
    @media (max-width: 640px) {
      .chips-container {
        min-height: 44px;
      }

      .selected-chips {
        padding: 8px 12px;
      }

      .chip {
        font-size: 12px;
        padding: 4px 10px;
      }

      .dropdown-toggle {
        padding: 10px 12px;
      }
    }
  `,
})
export class SelectMultipleChipsComponent
  extends IColleague
  implements IDropdownComponent, ControlValueAccessor
{
  private readonly elementRef = inject(ElementRef);

  // ControlValueAccessor implementation
  private onChange: (value: any[]) => void = () => {};
  private onTouched = () => {};
  private readonly isDisabledByForm = signal(false);

  // Inputs
  options = input<ChipItem[]>([]);
  selectedValues = input<any[]>([]);
  placeholder = input('Seleccionar elementos...');
  searchPlaceholder = input('Buscar...');
  noOptionsText = input('No hay opciones disponibles');
  searchable = input(true);
  disabled = input(false);
  maxSelections = input<number | null>(null);

  // Outputs
  selectionChange = output<ChipItem[]>();
  searchChange = output<string>();

  // Internal state
  isOpen = signal(false);
  searchTerm = signal('');
  removingChips = signal(new Set<string | number>());
  private readonly internalValue = signal<any[]>([]);

  // Computed properties
  selectedItems = computed(() => {
    // Use internal value if available (for reactive forms), otherwise use input
    const values =
      this.internalValue().length > 0
        ? this.internalValue()
        : this.selectedValues();
    return this.options().filter(option =>
      values.some(value => this.compareValues(option.value, value))
    );
  });

  filteredOptions = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    if (!search) return this.options();

    return this.options().filter(option =>
      option.label.toLowerCase().includes(search)
    );
  });

  // Check if component is disabled (either by input or by form)
  isComponentDisabled = computed(
    () => this.disabled() || this.isDisabledByForm()
  );

  constructor(mediatorService: MediatorService) {
    super(mediatorService.getMediator());
    // Register this component as a colleague with the mediator
    this.getMediator.addColleague(this);

    // Close dropdown when clicking outside
    effect(() => {
      if (this.isOpen()) {
        const handleClickOutside = (event: Event) => {
          const target = event.target as Element;
          if (!target.closest('.chips-container')) {
            this.closeDropdown();
            document.removeEventListener('click', handleClickOutside);
          }
        };
        setTimeout(
          () => document.addEventListener('click', handleClickOutside),
          0
        );
      }
    });
  }

  // Implementation of IColleague
  public receive(message: string): void {
    if (message === 'cerrar' || message === 'cerrar-todos') {
      if (this.isOpen()) {
        this.closeDropdown();
      }
    }
  }

  // Implementation of IDropdownComponent
  public close(): void {
    this.closeDropdown();
  }

  private closeDropdown(): void {
    this.isOpen.set(false);
    const mediator = this.getMediator as Mediator;
    if (mediator.activeDropdown === this) {
      mediator.activeDropdown = null;
      mediator.isAnyDropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    if (this.isComponentDisabled()) return;

    const mediator = this.getMediator as Mediator;

    if (this.isOpen()) {
      // If currently open, close it
      this.closeDropdown();
      mediator.send('cerrar', this);
    } else {
      // If currently closed, close all others first
      mediator.send('cerrar-todos', this);

      // Set this as active and open it
      mediator.activeDropdown = this;
      mediator.isAnyDropdownOpen = true;
      this.isOpen.set(true);

      // Focus search input if searchable
      setTimeout(() => {
        const searchInput = this.elementRef.nativeElement.querySelector(
          '.search-input'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutsideDropdown(event: MouseEvent): void {
    const mediator = this.getMediator as Mediator;

    // Check if the dropdown is open and click is outside
    if (this.isOpen()) {
      const clickedInside = this.elementRef.nativeElement.contains(
        event.target
      );
      if (!clickedInside) {
        event.stopPropagation();
        if (mediator.isAnyDropdownOpen) {
          mediator.send('cerrar-todos', this);
        }
        return;
      }
    }

    // If click is inside the component, stop propagation
    if (this.elementRef.nativeElement.contains(event.target)) {
      event.stopPropagation();
    }
  }

  toggleOption(option: ChipItem): void {
    if (option.disabled) return;

    // Mark as touched
    this.onTouched();

    const isCurrentlySelected = this.isSelected(option);
    let newSelection: ChipItem[];

    if (isCurrentlySelected) {
      // Remove item
      newSelection = this.selectedItems().filter(
        item => !this.compareValues(item.value, option.value)
      );
    } else {
      // Add item (check max selections)
      const maxSelections = this.maxSelections();
      if (maxSelections && this.selectedItems().length >= maxSelections) {
        return; // Don't add if max reached
      }
      newSelection = [...this.selectedItems(), option];
    }

    this.updateValue(newSelection);
  }

  removeItem(item: ChipItem): void {
    // Mark as touched
    this.onTouched();

    // Add chip to removing set to trigger animation
    const currentRemoving = this.removingChips();
    const newRemoving = new Set(currentRemoving);
    newRemoving.add(item.id);
    this.removingChips.set(newRemoving);

    // Wait for animation to complete before actually removing
    setTimeout(() => {
      const newSelection = this.selectedItems().filter(
        selected => !this.compareValues(selected.value, item.value)
      );
      this.updateValue(newSelection);

      // Remove from removing set
      const updatedRemoving = new Set(this.removingChips());
      updatedRemoving.delete(item.id);
      this.removingChips.set(updatedRemoving);
    }, 400); // Match animation duration
  }

  isSelected(option: ChipItem): boolean {
    return this.selectedItems().some(item =>
      this.compareValues(item.value, option.value)
    );
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchTerm.set(value);
    this.searchChange.emit(value);
  }

  // ControlValueAccessor implementation
  writeValue(value: any[]): void {
    if (value !== undefined && value !== null) {
      this.internalValue.set(Array.isArray(value) ? value : []);
    } else {
      this.internalValue.set([]);
    }
  }

  registerOnChange(fn: (value: any[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabledByForm.set(isDisabled);
  }

  private updateValue(newSelection: ChipItem[]): void {
    const values = newSelection.map(item => item.value);
    this.internalValue.set(values);
    this.onChange(values);
    this.onTouched();
    this.selectionChange.emit(newSelection);
  }

  private compareValues(a: any, b: any): boolean {
    if (
      typeof a === 'object' &&
      typeof b === 'object' &&
      a !== null &&
      b !== null
    ) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return a === b;
  }
}
