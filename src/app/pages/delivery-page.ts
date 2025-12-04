import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ITacoContent } from '../interfaces/definitions';
import { API_URL, TacosService } from '../services/data/tacos.service';
import { httpResource } from '@angular/common/http';
import { BtnComponent } from '../ui/atoms/btn/btn.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { UIDirtyResetDirective } from '../shared/directives/dirty-reset/dirty-reset.directive';

@Component({
  selector: 'app-delivery',
  imports: [ReactiveFormsModule, BtnComponent, UIDirtyResetDirective],
  template: `
    <form [formGroup]="form" class="form" (ngSubmit)="submit()">
      <!-- Sección Tortilla -->
      <div>
        <div class="row d-flex flex-row gap-2">
          <div class="mb-5">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="radio"
                formControlName="type"
                value="single" />
              Tortilla simple (precio base)
            </label>
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="radio"
                formControlName="type"
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
                    {{ filling.name }} ✓
                  } @else {
                    {{ filling.name }}
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
                  {{ filling.name
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
          <div formGroupName="tortilla">
            <label class="form-label" for="tortillaNombre"
              >Tipo de tortilla:</label
            >
            @if (tacosService.getTortillas.hasValue()) {
              <select
                class="form-control"
                formControlName="name"
                id="tortillaNombre"
                required>
                @for (
                  tortilla of tacosService.getTortillas.value();
                  track $index;
                  let i = $index
                ) {
                  <option #tortillaOption [ngValue]="tortilla">
                    {{ tortilla.name }}
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
                  {{ sauce.name }}
                </option>
              }
            </select>
          </div>
        </div>
      </div>
      <div class="btn-group mt-4">
        <!-- Sección Sauce -->
        <button
          class="bgGrayTxtBlue"
          app-dirty-reset
          [form]="form"
          (click)="limpiarFillingsSelected(); form.reset()">
          Restablecer
        </button>
        <button class="green" type="submit" [disabled]="form.invalid">
          Crear Pedido
        </button>
        <div>precio: {{ totalPrice() }}</div>
      </div>
    </form>
  `,
})
export class DeliveryPage {
  tacosService = inject(TacosService);
  formBuilder = inject(FormBuilder);

  fillingsSelecteds = signal<ITacoContent[]>([]);
  fillingsResource = httpResource<ITacoContent[]>(() => `${API_URL}/fillings`);
  protected readonly saucesResource = httpResource<ITacoContent[]>(
    () => `${API_URL}/sauces`
  );

  form = this.formBuilder.nonNullable.group({
    tortilla: this.formBuilder.nonNullable.group({
      name: this.formBuilder.nonNullable.control(''),
      price: this.formBuilder.nonNullable.control(0),
    }),
    type: this.formBuilder.nonNullable.control<'single' | 'double'>('single'),
    sauce: this.formBuilder.control<ITacoContent | null>(null),
    fillings: this.formBuilder.control<ITacoContent | null>(null),
  });

  private readonly _tortillaSeleccionada = toSignal(
    this.form.controls.tortilla.valueChanges,
    { initialValue: this.form.controls.tortilla.value }
  );
  private readonly tipoTortillaSeleccionado = toSignal(
    this.form.controls.type.valueChanges,
    { initialValue: this.form.controls.type.value }
  );

  protected readonly baseTortillaPrice = computed(
    () => this._tortillaSeleccionada()?.price ?? 0
  );
  private readonly sauceSeleccionada = toSignal(
    this.form.controls.sauce.valueChanges,
    { initialValue: this.form.controls.sauce.value }
  );

  protected readonly saucePrice = computed(
    () => this.sauceSeleccionada()?.price ?? 0
  );

  protected readonly tipoMultiplicador = computed(() =>
    this.tipoTortillaSeleccionado() === 'double' ? 2 : 1
  );

  protected readonly tortillaTotalPrice = computed(
    () => this.baseTortillaPrice() * this.tipoMultiplicador()
  );

  fillingsPrice = computed(() =>
    this.fillingsSelecteds().reduce(
      (total, filling) => total + filling.price,
      0
    )
  );
  protected readonly totalPrice = computed(
    () => this.tortillaTotalPrice() + this.fillingsPrice() + this.saucePrice()
  );

  isFillingSelected(filling: ITacoContent): boolean {
    return this.fillingsSelecteds().some(
      selected => selected.id === filling.id
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

  limpiarFillingsSelected(): void {
    this.fillingsSelecteds.set([]);
  }

  submit(): void {
    if (this.form.invalid) return;
    console.log('formulario enviado');
  }
}
