import { Component, OnInit, output, signal } from '@angular/core';
import { ITaco } from '../../../interfaces/i-taco';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ITacoContent } from '../../../interfaces/i-taco-content';
import { BtnComponent } from '../../../ui/atoms/btn/btn.component';
import { CardComponent } from '../../../ui/molecules/card/card.component';
import { ChipItem } from '../../../ui/features/select-multiple-chips/select-multiple-chips.component';
import { ISelectMultiple } from '../../../interfaces/definitions';

interface ITacoForm {
  tortilla: FormGroup<{
    nombre: FormControl<string>;
    tipo: FormControl<'simple' | 'doble'>;
    alimentos: FormControl<string | null>;
    salsa: FormControl<string | null>;
  }>;
}

@Component({
  selector: 'app-crear-taco-form',
  imports: [ReactiveFormsModule, BtnComponent, CardComponent],
  template: `
    <ui-card width100 titleText="Crear Taco">
      <div cardBody>
        <form [formGroup]="form" class="form" (ngSubmit)="onSubmit()">
          <!-- Sección Tortilla -->
          <div formGroupName="tortilla">
            <h3>Tortilla</h3>
            <div class="row d-flex flex-row gap-2">
              <div class="mb-5">
                <label class="form-check-label">
                  <input
                    class="form-check-input"
                    type="radio"
                    formControlName="tipo"
                    value="simple" />
                  Tortilla simple
                </label>
                <label class="form-check-label">
                  <input
                    class="form-check-input"
                    type="radio"
                    formControlName="tipo"
                    value="doble" />
                  Tortilla doble
                </label>
              </div>
              <div class="container-alimentos">
                <label class="form-label" for="tortillaAlimentos"
                  >Alimentos:</label
                >
                <select
                  class="form-control"
                  formControlName="alimentos"
                  name="tortillaAlimentos"
                  id="tortillaAlimentos">
                  @for (alimento of alimentosList; track alimento.id) {
                    <option [value]="alimento.value">
                      {{ alimento.label }} -
                      {{ alimento.selected ? 'selecionado' : '' }}
                    </option>
                  }
                </select>
              </div>
              <div>
                Alimentos seleccionados:
                <ul class="d-flex flex-row">
                  @for (alimento of alimentosList; track alimento.id) {
                    @if (alimento.selected) {
                      <li class="d-flex align-items-baseline">
                        {{ alimento.label
                        }}<ui-btn
                          (click)="alimento.selected = false"
                          icon="times"
                          noHover />
                      </li>
                    }
                  }
                </ul>
              </div>
            </div>

            <div class="row d-flex flex-row gap-5 align-items-baseline">
              <div>
                <label class="form-label" for="tortillaNombre"
                  >Tipo de tortilla:</label
                >
                <select
                  class="form-control"
                  formControlName="nombre"
                  id="tortillaNombre"
                  required>
                  @for (tortilla of tortillaList; track $index) {
                    <option [value]="tortilla">
                      {{ tortilla }}
                    </option>
                  }
                </select>
              </div>
              <div class="container-salsa">
                <label class="form-label" for="salsa">Salsa:</label>
                <select
                  class="form-control"
                  formControlName="salsa"
                  name="salsa"
                  id="salsa">
                  @for (salsa of salsaList; track $index) {
                    <option [value]="salsa.value">
                      {{ salsa.label }}
                    </option>
                  }
                </select>
              </div>
            </div>
          </div>
          <div class="btn-group mt-4">
            <!-- Sección Salsa -->
            <ui-btn
              [color]="'bgGrayTxtBlue'"
              [text]="'Restablecer'"
              [disabled]="form.pristine"
              (click)="form.reset()"></ui-btn>
            <ui-btn
              [color]="'green'"
              [text]="'Crear Pedido'"
              type="submit"
              [disabled]="form.invalid">
            </ui-btn>
          </div>
        </form>
      </div>
    </ui-card>
  `,
  styles: ``,
})
export class CrearTacoFormComponent implements OnInit {
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

  alimentosList: ISelectMultiple[] = [
    { id: 1, label: 'carne', value: 'carne', selected: false },
    { id: 2, label: 'queso', value: 'queso', selected: false },
    { id: 3, label: 'frijoles', value: 'frijoles', selected: false },
    { id: 4, label: 'aguacate', value: 'aguacate', selected: false },
    { id: 5, label: 'cebolla', value: 'cebolla', selected: false },
  ];

  salsaList: ChipItem[] = [
    { id: '-', label: '-', value: '-' },
    { id: 'salsa-verde', label: 'Salsa verde', value: 'salsa-verde' },
    { id: 'salsa-roja', label: 'Salsa roja', value: 'salsa-roja' },
    { id: 'salsa-mole', label: 'Salsa mole', value: 'salsa-mole' },
    { id: 'salsa-chipotle', label: 'Salsa chipotle', value: 'salsa-chipotle' },
    {
      id: 'salsa-tamarindo',
      label: 'Salsa de tamarindo',
      value: 'salsa-tamarindo',
    },
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
        tipo: new FormControl<'simple' | 'doble'>('simple', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        alimentos: new FormControl<string | null>(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        salsa: new FormControl<string | null>(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    });
  }

  ngOnInit(): void {
    this.form.controls.tortilla.controls.alimentos.valueChanges.subscribe(
      selectedValue => {
        if (selectedValue) {
          this.alimentosList.forEach(item => {
            if (item.value === selectedValue) {
              item.selected = true;
            }
          });
        }
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      // Crear objeto tortilla que implementa ITacoContent
      const tortilla: ITacoContent = {
        nombre: formValue.tortilla!.nombre!,
        precio: 2,
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

      this.submitTaco.emit(taco);
      this.form.reset();
    }
  }
}
