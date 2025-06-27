import { Component, output, signal } from '@angular/core';
import { ITaco } from '../../../interfaces/i-taco';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ITacoContent } from '../../../interfaces/i-taco-content';
import { IAlimento } from '../../../interfaces/i-alimento';
import { BtnComponent } from '../../../ui/atoms/btn/btn.component';
import { CardComponent } from '../../../ui/molecules/card/card.component';
import {
  ChipItem,
  SelectMultipleChipsComponent,
} from '../../../ui/features/select-multiple-chips/select-multiple-chips.component';

interface ITacoForm {
  tortilla: FormGroup<{
    nombre: FormControl<string>;
    precio: FormControl<number>;
    tipo: FormControl<'simple' | 'doble'>;
    alimentos: FormControl<ChipItem[] | null>;
  }>;
  salsa: FormGroup<{
    nombre: FormControl<string>;
    precio: FormControl<number>;
  }>;
}

@Component({
  selector: 'app-crear-taco-form',
  imports: [
    ReactiveFormsModule,
    BtnComponent,
    CardComponent,
    SelectMultipleChipsComponent,
  ],
  template: `
    <div class="container-card">
      <ui-card width100 titleText="Crear Taco">
        <div cardBody>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <!-- Sección Tortilla -->
            <div formGroupName="tortilla">
              <h3>Tortilla</h3>
              <div>
                <!-- grupo de 2 checkbox para elegir entre tortilla simple o doble -->
                <div class="radio-group">
                  <label>
                    <input type="radio" formControlName="tipo" value="simple" />
                    Tortilla simple
                  </label>
                  <label>
                    <input type="radio" formControlName="tipo" value="doble" />
                    Tortilla doble
                  </label>
                </div>

                <label for="tortillaNombre">Tipo de tortilla:</label>
                <select formControlName="nombre" id="tortillaNombre" required>
                  @for (tortilla of tortillaList; track $index) {
                    <option [value]="tortilla">
                      {{ tortilla }}
                    </option>
                  }
                </select>
                <!-- <ui-filtro [filtro]="tortillaList" > -->
                <!-- <input
                  id="tortillaNombre"
                  formControlName="nombre"
                  type="text"
                  required
                  placeholder="Ej: Tortilla de maíz" /> -->
              </div>
              <div>
                <app-select-multiple-chips
                  [options]="alimentosList"
                  [placeholder]="'Selecciona tipo de tortilla...'"
                  [searchable]="true"
                  formControlName="alimentos" />
              </div>
              <div>
                <label for="tortillaPrecio">Precio de la tortilla:</label>
                <input
                  id="tortillaPrecio"
                  formControlName="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="Ej: 15.50" />
              </div>
            </div>

            <!-- Sección Salsa -->
            <div formGroupName="salsa">
              <h3>Salsa (Opcional)</h3>
              <div>
                <label for="salsaNombre">Nombre de la salsa:</label>
                <input
                  id="salsaNombre"
                  formControlName="nombre"
                  type="text"
                  placeholder="Ej: Salsa verde" />
              </div>
              <div>
                <label for="salsaPrecio">Precio de la salsa:</label>
                <input
                  id="salsaPrecio"
                  formControlName="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ej: 5.00" />
              </div>
            </div>

            <ui-btn
              [color]="'blue'"
              [text]="'Crear Taco'"
              type="submit"
              [disabled]="form.invalid"></ui-btn>
          </form>
        </div>
      </ui-card>
    </div>
  `,
  styles: `
    .container-card {
      display: flex;
      justify-content: center;
      padding: 20px;
      background-color: #f0f0f0;
      box-sizing: border-box;
      font-family: 'Arial', sans-serif;
      color: #333;
    }

    form {
      max-width: 500px;
      margin: 0 auto;
      padding: 20px;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      // gap: 20px;
      // margin-bottom: 15px;
      label {
        font-weight: normal;
        text-wrap: nowrap;
        color: #555;
      }
    }

    div[formGroupName] {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      background-color: #f9f9f9;
    }

    h3 {
      margin-top: 0;
      color: #333;
    }

    div {
      margin-bottom: 10px;
    }

    // label {
    //   display: block;
    //   margin-bottom: 5px;
    //   font-weight: bold;
    //   color: #555;
    // }

    // input {
    //   width: 100%;
    //   padding: 8px 12px;
    //   border: 1px solid #ccc;
    //   border-radius: 4px;
    //   font-size: 14px;
    //   box-sizing: border-box;
    // }

    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    button {
      width: 100%;
      padding: 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      margin-top: 10px;
    }

    button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }
  `,
})
export class CrearTacoFormComponent {
  tortillaList: string[] = [
    'Tortilla de maíz',
    'Tortilla de harina',
    'Tortilla de nopal',
    'Tortilla de trigo',
    'Tortilla de arroz',
    'Tortilla de avena',
    'Tortilla de espinaca',
    'Tortilla de betabel',
    'Tortilla de quinoa',
    'Tortilla de papa',
  ];

  alimentosList: ChipItem[] = [
    { id: 'tortilla', label: 'carne', value: 'carne' },
    { id: 'queso', label: 'queso', value: 'queso' },
    { id: 'frijoles', label: 'frijoles', value: 'frijoles' },
    { id: 'aguacate', label: 'aguacate', value: 'aguacate' },
    { id: 'cebolla', label: 'cebolla', value: 'cebolla' },
  ];

  submitTaco = output<ITaco>();

  form: FormGroup<ITacoForm>;

  private readonly _taco = signal<ITaco | null>(null);
  get taco(): ITaco | null {
    return this._taco();
  }
  set taco(value: ITaco | null) {
    this._taco.set(value);
  }

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group<ITacoForm>({
      tortilla: this.formBuilder.group({
        nombre: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(2)],
        }),
        precio: new FormControl<number>(0, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0.01)],
        }),
        tipo: new FormControl<'simple' | 'doble'>('simple', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        alimentos: new FormControl<ChipItem[] | null>(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      salsa: this.formBuilder.group({
        nombre: new FormControl<string>('', { nonNullable: true }),
        precio: new FormControl<number>(0, { nonNullable: true }),
      }),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      // Crear objeto tortilla que implementa ITacoContent
      const tortilla: ITacoContent = {
        nombre: formValue.tortilla!.nombre!,
        precio: formValue.tortilla!.precio!,
        getPrecioCosto: function () {
          return this.precio;
        },
      };

      // Crear objeto taco
      const taco: ITaco = {
        tortilla: tortilla,
        getPrecioCosto: function () {
          let costo = this.tortilla.getPrecioCosto();
          if (this.salsa) {
            costo += this.salsa.getPrecioCosto();
          }
          return costo;
        },
      };

      // Solo agregar salsa si tiene nombre
      if (formValue.salsa!.nombre!.trim()) {
        const salsa: IAlimento = {
          nombre: formValue.salsa!.nombre!,
          precio: formValue.salsa!.precio!,
          tipoAlimento: 'salsa',
          getPrecioCosto: function () {
            return this.precio;
          },
        };
        taco.salsa = salsa;
      }

      this.submitTaco.emit(taco);
      this.form.reset();
    }
  }
}
