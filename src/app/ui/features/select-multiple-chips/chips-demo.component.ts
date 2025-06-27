import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  SelectMultipleChipsComponent,
  ChipItem,
} from './select-multiple-chips.component';

@Component({
  selector: 'app-chips-demo',
  imports: [SelectMultipleChipsComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-container">
      <h2>Selector de Chips Múltiple - Demo</h2>

      <!-- Formulario Reactivo -->
      <div class="demo-section">
        <h3>Formulario Reactivo</h3>
        <form [formGroup]="demoForm" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <label for="ingredients">Ingredientes (requerido):</label>
            <app-select-multiple-chips
              id="ingredients"
              formControlName="ingredients"
              [options]="alimentosRelleno()"
              [placeholder]="'Selecciona ingredientes...'"
              [searchPlaceholder]="'Buscar ingredientes...'" />

            @if (
              demoForm.get('ingredients')?.invalid &&
              demoForm.get('ingredients')?.touched
            ) {
              <div class="error-message">
                @if (demoForm.get('ingredients')?.errors?.['required']) {
                  <span>Debes seleccionar al menos un ingrediente</span>
                }
                @if (demoForm.get('ingredients')?.errors?.['minlength']) {
                  <span>Debes seleccionar al menos 2 ingredientes</span>
                }
              </div>
            }
          </div>

          <div class="form-field">
            <label for="salsas">Salsas:</label>
            <app-select-multiple-chips
              id="salsas"
              formControlName="salsas"
              [options]="tiposSalsa()"
              [placeholder]="'Selecciona salsas (opcional)...'"
              [searchPlaceholder]="'Buscar salsas...'"
              [maxSelections]="3" />
          </div>

          <div class="form-actions">
            <button
              type="submit"
              [disabled]="demoForm.invalid"
              class="submit-btn">
              Crear Taco
            </button>
            <button type="button" (click)="resetForm()" class="reset-btn">
              Limpiar
            </button>
            <button
              type="button"
              (click)="toggleFormDisabled()"
              class="toggle-btn">
              {{ demoForm.disabled ? 'Habilitar' : 'Deshabilitar' }} Formulario
            </button>
          </div>

          <div class="form-debug">
            <h4>Estado del Formulario:</h4>
            <pre>{{ getFormStatus() }}</pre>
          </div>
        </form>
      </div>

      <!-- Demo Original -->
      <div class="demo-section">
        <h3>Alimentos de Relleno (Modo Input)</h3>
        <app-select-multiple-chips
          [options]="alimentosRelleno()"
          [selectedValues]="selectedAlimentos()"
          [placeholder]="'Selecciona alimentos de relleno...'"
          [searchPlaceholder]="'Buscar alimentos...'"
          (selectionChange)="onAlimentosChange($event)" />

        <div class="selected-display">
          <strong>Seleccionados:</strong>
          @if (selectedAlimentos().length === 0) {
            <span class="empty">Ninguno seleccionado</span>
          } @else {
            <span>{{
              getSelectedLabels(selectedAlimentos(), alimentosRelleno())
            }}</span>
          }
        </div>
      </div>

      <div class="demo-section">
        <h3>Tipos de Salsa (Modo Input)</h3>
        <app-select-multiple-chips
          [options]="tiposSalsa()"
          [selectedValues]="selectedSalsas()"
          [placeholder]="'Selecciona tipos de salsa...'"
          [searchPlaceholder]="'Buscar salsas...'"
          [maxSelections]="2"
          (selectionChange)="onSalsasChange($event)" />

        <div class="selected-display">
          <strong>Seleccionadas (máx. 2):</strong>
          @if (selectedSalsas().length === 0) {
            <span class="empty">Ninguna seleccionada</span>
          } @else {
            <span>{{ getSelectedLabels(selectedSalsas(), tiposSalsa()) }}</span>
          }
        </div>
      </div>

      <div class="demo-section">
        <h3>Tipos de Tortilla</h3>
        <app-select-multiple-chips
          [options]="tiposTortilla()"
          [selectedValues]="selectedTortillas()"
          [placeholder]="'Selecciona tipos de tortilla...'"
          [searchable]="false"
          (selectionChange)="onTortillasChange($event)" />

        <div class="selected-display">
          <strong>Seleccionadas (sin búsqueda):</strong>
          @if (selectedTortillas().length === 0) {
            <span class="empty">Ninguna seleccionada</span>
          } @else {
            <span>{{
              getSelectedLabels(selectedTortillas(), tiposTortilla())
            }}</span>
          }
        </div>
      </div>

      <div class="demo-section">
        <h3>Ejemplo Deshabilitado</h3>
        <app-select-multiple-chips
          [options]="alimentosRelleno()"
          [selectedValues]="['carne', 'pollo']"
          [placeholder]="'Este selector está deshabilitado...'"
          [disabled]="true" />
      </div>

      <div class="demo-section summary">
        <h3>Resumen de Selección</h3>
        <div class="summary-content">
          <div class="summary-item">
            <span class="label">Alimentos:</span>
            <span class="value"
              >{{ selectedAlimentos().length }} seleccionados</span
            >
          </div>
          <div class="summary-item">
            <span class="label">Salsas:</span>
            <span class="value"
              >{{ selectedSalsas().length }} seleccionadas</span
            >
          </div>
          <div class="summary-item">
            <span class="label">Tortillas:</span>
            <span class="value"
              >{{ selectedTortillas().length }} seleccionadas</span
            >
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .demo-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .demo-container h2 {
      color: #1f2937;
      margin-bottom: 32px;
      text-align: center;
      font-size: 28px;
      font-weight: 600;
    }

    .demo-section {
      margin-bottom: 32px;
      padding: 24px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      background: #f9fafb;
    }

    .demo-section h3 {
      color: #374151;
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 600;
    }

    .selected-display {
      margin-top: 12px;
      padding: 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      font-size: 14px;
    }

    .selected-display .empty {
      color: #9ca3af;
      font-style: italic;
    }

    .summary {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-color: #3b82f6;
    }

    .summary-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .summary-item .label {
      font-weight: 600;
      color: #374151;
    }

    .summary-item .value {
      color: #3b82f6;
      font-weight: 500;
    }

    @media (max-width: 640px) {
      .demo-container {
        padding: 16px;
      }

      .demo-section {
        padding: 16px;
      }

      .summary-content {
        grid-template-columns: 1fr;
      }
    }

    /* Form styles */
    .form-field {
      margin-bottom: 20px;
    }

    .form-field label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .error-message {
      margin-top: 8px;
      padding: 8px 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      color: #dc2626;
      font-size: 13px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      flex-wrap: wrap;
    }

    .submit-btn,
    .reset-btn,
    .toggle-btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid;
    }

    .submit-btn {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .submit-btn:hover:not(:disabled) {
      background: #2563eb;
      border-color: #2563eb;
    }

    .submit-btn:disabled {
      background: #9ca3af;
      border-color: #9ca3af;
      cursor: not-allowed;
    }

    .reset-btn {
      background: #f3f4f6;
      color: #374151;
      border-color: #d1d5db;
    }

    .reset-btn:hover {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    .toggle-btn {
      background: #f59e0b;
      color: white;
      border-color: #f59e0b;
    }

    .toggle-btn:hover {
      background: #d97706;
      border-color: #d97706;
    }

    .form-debug {
      margin-top: 24px;
      padding: 16px;
      background: #f3f4f6;
      border-radius: 8px;
      border: 1px solid #d1d5db;
    }

    .form-debug h4 {
      margin: 0 0 12px 0;
      color: #374151;
      font-size: 14px;
      font-weight: 600;
    }

    .form-debug pre {
      background: white;
      padding: 12px;
      border-radius: 6px;
      font-size: 12px;
      overflow-x: auto;
      margin: 0;
      border: 1px solid #e5e7eb;
    }
  `,
})
export class ChipsDemoComponent {
  // Reactive Form
  demoForm = new FormGroup({
    ingredients: new FormControl<string[]>([], {
      validators: [Validators.required, this.minArrayLength(2)],
    }),
    salsas: new FormControl<string[]>([]),
  });

  // Custom validator for minimum array length
  private minArrayLength(min: number) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value || !Array.isArray(value) || value.length < min) {
        return {
          minlength: { requiredLength: min, actualLength: value?.length || 0 },
        };
      }
      return null;
    };
  }

  // Food options
  alimentosRelleno = signal<ChipItem[]>([
    { id: 'carne', label: 'Carne', value: 'carne' },
    { id: 'pollo', label: 'Pollo', value: 'pollo' },
    { id: 'verdura', label: 'Verdura', value: 'verdura' },
    { id: 'queso', label: 'Queso', value: 'queso' },
    { id: 'bondiola', label: 'Bondiola', value: 'bondiola' },
    { id: 'frijoles', label: 'Frijoles', value: 'frijoles' },
    { id: 'arroz', label: 'Arroz', value: 'arroz' },
    { id: 'jalapeños', label: 'Jalapeños', value: 'jalapeños' },
    { id: 'aguacate', label: 'Aguacate', value: 'aguacate' },
    { id: 'lechuga', label: 'Lechuga', value: 'lechuga' },
  ]);

  tiposSalsa = signal<ChipItem[]>([
    { id: 'blanca', label: 'Salsa Blanca', value: 'blanca' },
    { id: 'roja', label: 'Salsa Roja', value: 'roja' },
    { id: 'verde', label: 'Salsa Verde', value: 'verde' },
    { id: 'picante', label: 'Salsa Picante', value: 'picante' },
    { id: 'chipotle', label: 'Salsa Chipotle', value: 'chipotle' },
    {
      id: 'habanero',
      label: 'Salsa Habanero',
      value: 'habanero',
      disabled: true,
    },
  ]);

  tiposTortilla = signal<ChipItem[]>([
    { id: 'maiz', label: 'Tortilla de Maíz', value: 'maiz' },
    { id: 'harina', label: 'Tortilla de Harina', value: 'harina' },
    { id: 'integral', label: 'Tortilla Integral', value: 'integral' },
    { id: 'spinach', label: 'Tortilla de Espinaca', value: 'spinach' },
  ]);

  // Selected values
  selectedAlimentos = signal<string[]>([]);
  selectedSalsas = signal<string[]>([]);
  selectedTortillas = signal<string[]>([]);

  onAlimentosChange(selected: ChipItem[]): void {
    this.selectedAlimentos.set(selected.map(item => item.value));
  }

  onSalsasChange(selected: ChipItem[]): void {
    this.selectedSalsas.set(selected.map(item => item.value));
  }

  onTortillasChange(selected: ChipItem[]): void {
    this.selectedTortillas.set(selected.map(item => item.value));
  }

  getSelectedLabels(selectedValues: string[], options: ChipItem[]): string {
    return options
      .filter(option => selectedValues.includes(option.value))
      .map(option => option.label)
      .join(', ');
  }

  // Form methods
  onSubmit(): void {
    if (this.demoForm.valid) {
      console.log('Form submitted:', this.demoForm.value);
      alert(
        `Taco creado con:\n- Ingredientes: ${this.getFormIngredientLabels()}\n- Salsas: ${this.getFormSalsaLabels()}`
      );
    }
  }

  resetForm(): void {
    this.demoForm.reset({
      ingredients: [],
      salsas: [],
    });
  }

  toggleFormDisabled(): void {
    if (this.demoForm.disabled) {
      this.demoForm.enable();
    } else {
      this.demoForm.disable();
    }
  }

  getFormStatus(): string {
    return JSON.stringify(
      {
        value: this.demoForm.value,
        valid: this.demoForm.valid,
        disabled: this.demoForm.disabled,
        touched: this.demoForm.touched,
        dirty: this.demoForm.dirty,
      },
      null,
      2
    );
  }

  getFormIngredientLabels(): string {
    const selectedValues = this.demoForm.get('ingredients')?.value || [];
    return this.getSelectedLabels(selectedValues, this.alimentosRelleno());
  }

  getFormSalsaLabels(): string {
    const selectedValues = this.demoForm.get('salsas')?.value || [];
    return this.getSelectedLabels(selectedValues, this.tiposSalsa());
  }
}
