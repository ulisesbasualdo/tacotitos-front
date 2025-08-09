import { Component, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BtnComponent } from '../../../ui/atoms/btn/btn.component';
import {
  ITaco,
  ITacoContent,
  IAlimento,
  ISelectMultiple,
  ISelectSimple,
} from '../../../interfaces/definitions';
import { TacosService } from '../../../services/data/tacos.service';

interface ITacoForm {
  tortilla: FormGroup<{
    id: FormControl<string>;
    nombre: FormControl<string>;
    tipo: FormControl<'simple' | 'doble'>;
    alimentos: FormControl<string | null>;
    salsa: FormControl<string | null>;
  }>;
}

@Component({
  selector: 'app-crear-taco-form',
  imports: [ReactiveFormsModule, BtnComponent],
  template: `
    <form [formGroup]="form" class="form" (ngSubmit)="onSubmit()">
      <!-- Sección Tortilla -->
      <div formGroupName="tortilla">
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
          <div class="container-alimentos mb-3">
            <label class="form-label " for="tortillaAlimentos"
              >Alimentos:</label
            >
            <select
              class="form-control mt-2"
              formControlName="alimentos"
              name="tortillaAlimentos"
              id="tortillaAlimentos">
              @for (alimento of alimentosList; track alimento.id) {
                <option [value]="alimento.value">
                  @if (alimento.selected) {
                    {{ alimento.label }} ✓
                  } @else {
                    {{ alimento.label }}
                  }
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
                      noBg />
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
          (click)="limpiarAlimentosSelected(); form.reset()"></ui-btn>
        <ui-btn
          [color]="'green'"
          [text]="'Crear Pedido'"
          type="submit"
          [disabled]="form.invalid">
        </ui-btn>
      </div>
    </form>
  `,
  styles: ``,
})
export class CrearTacoFormComponent implements OnInit {
  tortillaList: string[] = [];

  alimentosList: ISelectMultiple[] = [];

  salsaList: ISelectSimple[] = [];

  submitTaco = output<ITaco>();

  form: FormGroup<ITacoForm>;

  autoIncrementalIdTortillaList = 0;
  autoIncrementalIdAlimentosList = 0;
  autoIncrementalIdSalsasList = 0;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly tacosService: TacosService
  ) {
    this.form = this.formBuilder.group<ITacoForm>({
      tortilla: this.formBuilder.group({
        id: new FormControl<string>('0', {
          nonNullable: true,
        }),
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
    this.fillTortillaList();
    this.fillAlimentoList();
    this.fillSalsasList();
  }

  // TODO: no pasar id ni precio, esto es la orden de delivery y esos campos deben ser manejados por el backend
  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (!formValue.tortilla) {
        console.log('error al obtener el formulario');
        return;
      }
      const tortilla: ITacoContent = {
        id: formValue.tortilla.id!,
        nombre: formValue.tortilla.nombre!,
        precio: 2,
      };
      const alimentos = this.alimentosList
        .filter(alimento => alimento.selected)
        .map(alimento => {
          return {
            id: alimento.id.toString(),
            nombre: alimento.label,
            precio: 1,
            tipoAlimento: 'alimentoTortilla',
          } as IAlimento;
        });
      const taco: ITaco = {
        tortilla: tortilla,
        alimentos: alimentos,
        precio: 100,
      };
      this.submitTaco.emit(taco);
      this.form.reset();
    }
  }

  fillTortillaList() {
    this.tacosService.getTortillas().subscribe(tortilla => {
      if (!tortilla) {
        console.log('error al obtener tortillas');
        return;
      }
      tortilla.forEach(tortilla => {
        this.tortillaList.push(tortilla.nombre);
      });
    });
  }

  fillAlimentoList(): void {
    this.tacosService.getAlimentos().subscribe(alimentos => {
      if (!alimentos) {
        console.log('error al obtener alimentos');
        return;
      }
      alimentos.forEach(alimento => {
        if (alimento.tipoAlimento === 'alimentoTortilla') {
          this.alimentosList.push({
            id: this.autoIncrementalIdTortillaList++,
            label: alimento.nombre,
            value: alimento.nombre,
            selected: false,
          });
        }
      });
    });
  }

  fillSalsasList(): void {
    this.tacosService.getSalsas().subscribe(salsas => {
      if (!salsas) {
        console.log('error al obtener alimentos');
        return;
      }
      salsas.forEach(salsa => {
        if (salsa.tipoAlimento === 'salsa') {
          this.salsaList.push({
            id: this.autoIncrementalIdSalsasList++,
            label: salsa.nombre,
            value: salsa.nombre,
          });
        }
      });
    });
  }

  limpiarAlimentosSelected() {
    this.alimentosList.forEach(alimento => {
      alimento.selected = false;
    });
  }

  alimentosSeleccionados(): ISelectSimple[] | null {
    const alimentos: ISelectSimple[] | null = [];
    this.alimentosList.forEach(alimento => {
      alimentos.push(alimento);
    });
    return alimentos.length > 0 ? alimentos : null;
  }
}
