import {
  Component,
  computed,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
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
  ISelectSimple,
} from '../../../interfaces/definitions';
import { API_URL, TacosService } from '../../../services/data/tacos.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';

interface ITacoForm {
  tortilla: FormGroup<{
    id: FormControl<string>;
    nombre: FormControl<ITacoContent | null>;
    tipo: FormControl<'simple' | 'doble'>;
    alimentos: FormControl<IAlimento | null>;
    salsa: FormControl<IAlimento | null>;
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
              Tortilla simple (precio base)
            </label>
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="radio"
                formControlName="tipo"
                value="doble" />
              Tortilla doble (x2 precio tortilla)
            </label>
          </div>

          <!-- ALIMENTOS -->

          <div class="container-alimentos mb-3">
            <label class="form-label " for="tortillaAlimentos"
              >Alimentos:</label
            >
            <select
              class="form-control mt-2"
              formControlName="alimentos"
              name="tortillaAlimentos"
              id="tortillaAlimentos">
              @for (alimento of alimentosResource.value(); track $index) {
                <option [ngValue]="alimento" #optionAlimento>
                  @if (isAlimentoSelected(alimento)) {
                    {{ alimento.nombre }} ✓
                  } @else {
                    {{ alimento.nombre }}
                  }
                </option>
              }
            </select>
          </div>
          <div>
            Alimentos seleccionados:
            <ul class="d-flex flex-row">
              @for (alimento of alimentosSelecteds(); track $index) {
                <li class="d-flex align-items-baseline">
                  {{ alimento.nombre
                  }}<ui-btn
                    (click)="unsetSelected(alimento)"
                    icon="times"
                    noBg />
                </li>
              }
            </ul>
          </div>
        </div>

        <!-- FIN ALIMENTOS -->

        <div class="row d-flex flex-row gap-5 align-items-baseline">
          <div>
            <label class="form-label" for="tortillaNombre"
              >Tipo de tortilla:</label
            >
            @if (tacosService.getTortillas.hasValue()) {
              <select
                class="form-control"
                formControlName="nombre"
                id="tortillaNombre"
                required>
                @for (
                  tortilla of tacosService.getTortillas.value();
                  track $index;
                  let i = $index
                ) {
                  <option #tortillaOption [ngValue]="tortilla">
                    {{ tortilla.nombre }}
                  </option>
                }
              </select>
            }
          </div>
          <div class="container-salsa">
            <label class="form-label" for="salsa">Salsa:</label>
            <select
              class="form-control"
              formControlName="salsa"
              name="salsa"
              id="salsa">
              @for (salsa of salsasResource.value(); track salsa.id) {
                <option [ngValue]="salsa">
                  {{ salsa.nombre }}
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
        <div>precio: {{ totalPrice() }}</div>
      </div>
    </form>
  `,
  styles: ``,
})
export class CrearTacoFormComponent implements OnInit {
  tacosService = inject(TacosService);
  formBuilder = inject(FormBuilder);

  form: FormGroup<ITacoForm> = this.formBuilder.group<ITacoForm>({
    tortilla: this.formBuilder.group({
      id: new FormControl<string>('0', {
        nonNullable: true,
      }),
      nombre: new FormControl<ITacoContent | null>(null, {
        nonNullable: false,
        validators: [Validators.required],
      }),
      tipo: new FormControl<'simple' | 'doble'>('simple', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      alimentos: new FormControl<IAlimento | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      salsa: new FormControl<IAlimento | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    }),
  });

  private readonly _tortillaSeleccionada = toSignal(
    this.form.controls.tortilla.controls.nombre.valueChanges,
    { initialValue: this.form.controls.tortilla.controls.nombre.value }
  );
  private readonly tipoTortillaSeleccionado = toSignal(
    this.form.controls.tortilla.controls.tipo.valueChanges,
    { initialValue: this.form.controls.tortilla.controls.tipo.value }
  );

  private readonly salsaSeleccionada = toSignal(
    this.form.controls.tortilla.controls.salsa.valueChanges,
    { initialValue: this.form.controls.tortilla.controls.salsa.value }
  );
  tortillaPrice = computed(() => this._tortillaSeleccionada()?.precio ?? 0);
  alimentosPrice = computed(() =>
    this.alimentosSelecteds().reduce(
      (total, alimento) => total + alimento.precio,
      0
    )
  );
  protected readonly salsaPrice = computed(
    () => this.salsaSeleccionada()?.precio ?? 0
  );
  protected readonly totalPrice = computed(
    () => this.tortillaTotalPrice() + this.alimentosPrice() + this.salsaPrice()
  );
  alimentosSelecteds = signal<IAlimento[]>([]);
  alimentosResource = httpResource<IAlimento[]>(() => `${API_URL}/alimentos`);
  protected readonly salsasResource = httpResource<IAlimento[]>(
    () => `${API_URL}/salsas`
  );
  protected readonly baseTortillaPrice = computed(
    () => this._tortillaSeleccionada()?.precio ?? 0
  );

  protected readonly tipoMultiplicador = computed(() =>
    this.tipoTortillaSeleccionado() === 'doble' ? 2 : 1
  );

  protected readonly tortillaTotalPrice = computed(
    () => this.baseTortillaPrice() * this.tipoMultiplicador()
  );
  salsaList: ISelectSimple[] = [];
  submitTaco = output<ITaco>();

  autoIncrementalIdTortillaList = 0;
  autoIncrementalIdAlimentosList = 0;
  autoIncrementalIdSalsasList = 0;

  ngOnInit(): void {
    this.form.controls.tortilla.controls.alimentos.valueChanges.subscribe(
      changes => {
        this.setSelected(changes);
      }
    );
  }

  setSelected(alimento: IAlimento | null): void {
    if (!alimento) {
      return;
    }

    const yaSeleccionado = this.alimentosSelecteds().find(
      a => a.id === alimento.id
    );

    if (!yaSeleccionado) {
      this.alimentosSelecteds.update(current => [...current, alimento]);
    }
  }

  unsetSelected(alimento: IAlimento): void {
    this.alimentosSelecteds.update(current =>
      current.filter(a => a.id !== alimento.id)
    );
  }

  isAlimentoSelected(alimento: IAlimento): boolean {
    return this.alimentosSelecteds().some(
      selected => selected.id === alimento.id
    );
  }

  onSubmit() {
    console.log('enviado');
  }

  limpiarAlimentosSelected() {
    this.alimentosSelecteds.set([]);
  }
}
