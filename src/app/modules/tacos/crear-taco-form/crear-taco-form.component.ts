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
  ISelectSimple,
} from '../../../interfaces/definitions';
import { API_URL, TacosService } from '../../../services/data/tacos.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { httpResource } from '@angular/common/http';

interface ITacoForm {
  tortilla: FormGroup<{
    id: FormControl<number>;
    nombre: FormControl<ITacoContent | null>;
    tipo: FormControl<'single' | 'double'>;
    fillings: FormControl<ITacoContent | null>;
    sauce: FormControl<ITacoContent | null>;
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
                value="single" />
              Tortilla simple (precio base)
            </label>
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="radio"
                formControlName="tipo"
                value="double" />
              Tortilla doble (x2 precio tortilla)
            </label>
          </div>

          <!-- FILLINGS -->

          <div class="container-fillings mb-3">
            <label class="form-label " for="tortillaFillings">Fillings:</label>
            <select
              class="form-control mt-2"
              formControlName="fillings"
              name="tortillaFillings"
              id="tortillaFillings">
              @for (filling of fillingsResource.value(); track $index) {
                <option [ngValue]="filling" #optionFilling>
                  @if (isFillingSelected(filling)) {
                    {{ filling.nombre }} ✓
                  } @else {
                    {{ filling.nombre }}
                  }
                </option>
              }
            </select>
          </div>
          <div>
            Fillings seleccionados:
            <ul class="d-flex flex-row">
              @for (filling of fillingsSelecteds(); track $index) {
                <li class="d-flex align-items-baseline">
                  {{ filling.nombre
                  }}<ui-btn
                    (click)="unsetSelected(filling)"
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
          <div class="container-sauce">
            <label class="form-label" for="sauce">Sauce:</label>
            <select
              class="form-control"
              formControlName="sauce"
              name="sauce"
              id="sauce">
              @for (sauce of saucesResource.value(); track sauce.id) {
                <option [ngValue]="sauce">
                  {{ sauce.nombre }}
                </option>
              }
            </select>
          </div>
        </div>
      </div>
      <div class="btn-group mt-4">
        <!-- Sección Sauce -->
        <ui-btn
          [color]="'bgGrayTxtBlue'"
          [text]="'Restablecer'"
          [disabled]="form.pristine"
          (click)="limpiarFillingsSelected(); form.reset()"></ui-btn>
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
      id: new FormControl<number>(0, {
        nonNullable: true,
      }),
      nombre: new FormControl<ITacoContent | null>(null, {
        nonNullable: false,
        validators: [Validators.required],
      }),
      tipo: new FormControl<'single' | 'double'>('single', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      fillings: new FormControl<ITacoContent | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      sauce: new FormControl<ITacoContent | null>(null, {
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

  private readonly sauceSeleccionada = toSignal(
    this.form.controls.tortilla.controls.sauce.valueChanges,
    { initialValue: this.form.controls.tortilla.controls.sauce.value }
  );
  tortillaPrice = computed(() => this._tortillaSeleccionada()?.precio ?? 0);
  fillingsPrice = computed(() =>
    this.fillingsSelecteds().reduce(
      (total, filling) => total + filling.precio,
      0
    )
  );
  protected readonly saucePrice = computed(
    () => this.sauceSeleccionada()?.precio ?? 0
  );
  protected readonly totalPrice = computed(
    () => this.tortillaTotalPrice() + this.fillingsPrice() + this.saucePrice()
  );
  fillingsSelecteds = signal<ITacoContent[]>([]);
  fillingsResource = httpResource<ITacoContent[]>(() => `${API_URL}/fillings`);
  protected readonly saucesResource = httpResource<ITacoContent[]>(
    () => `${API_URL}/sauces`
  );
  protected readonly baseTortillaPrice = computed(
    () => this._tortillaSeleccionada()?.precio ?? 0
  );

  protected readonly tipoMultiplicador = computed(() =>
    this.tipoTortillaSeleccionado() === 'double' ? 2 : 1
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
    this.form.controls.tortilla.controls.fillings.valueChanges.subscribe(
      changes => {
        this.setSelected(changes);
      }
    );
  }

  setSelected(filling: ITacoContent | null): void {
    if (!filling) {
      return;
    }

    const yaSeleccionado = this.fillingsSelecteds().find(
      f => f.id === filling.id
    );

    if (!yaSeleccionado) {
      this.fillingsSelecteds.update(current => [...current, filling]);
    }
  }

  unsetSelected(filling: ITacoContent): void {
    this.fillingsSelecteds.update(current =>
      current.filter(f => f.id !== filling.id)
    );
  }

  isFillingSelected(filling: ITacoContent): boolean {
    return this.fillingsSelecteds().some(
      selected => selected.id === filling.id
    );
  }

  onSubmit(): void {
    console.log('enviado');
  }

  limpiarFillingsSelected(): void {
    this.fillingsSelecteds.set([]);
  }
}
