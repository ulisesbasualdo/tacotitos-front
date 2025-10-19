import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { BtnComponent } from '../../../../../ui/atoms/btn/btn.component';
import {
  IFillingEditable,
  ITacoContent,
} from '../../../../../interfaces/definitions';
import { TacosService } from '../../../../../services/data/tacos.service';

interface IFillingForm {
  id: FormControl<number>;
  nombre: FormControl<string>;
  precio: FormControl<number>;
}

@Component({
  selector: 'app-fillings',
  imports: [BtnComponent, ReactiveFormsModule],
  template: `
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input
              #inputNombreAgregar
              type="text"
              placeholder="ingrese un nombre" />
          </td>
          <td>
            <input
              #inputPrecioAgregar
              type="text"
              placeholder="ingrese un precio"
              class="text-right" />
          </td>
          <td>
            <ui-btn
              icon="plus"
              (click)="
                add(
                  inputNombreAgregar.value,
                  inputPrecioAgregar.value,
                  inputNombreAgregar,
                  inputPrecioAgregar
                )
              " />
          </td>
        </tr>
        @for (item of fillings(); track item.id) {
          <tr>
            @if (!item.editMode) {
              <td>{{ item.nombre }}</td>
              <td>{{ item.precio }}</td>
              <td>
                <ui-btn (click)="habilitarEditar(item.id)" icon="pen" />
                <ui-btn icon="save" />
                <ui-btn icon="trash" (click)="deleteFilling(item.id)" />
              </td>
            } @else {
              <td>
                <input
                  #inputNombre
                  type="text"
                  placeholder="ingrese un nombre"
                  [value]="item.nombre" />
              </td>
              <td>
                <input
                  #inputPrecio
                  type="text"
                  placeholder="ingrese un precio"
                  class="text-right"
                  [value]="item.precio" />
              </td>
              <td>
                <ui-btn (click)="item.editMode = false" icon="times" />
                <ui-btn
                  icon="save"
                  (click)="
                    saveEdit(item, inputNombre.value, inputPrecio.value)
                  " />
                <ui-btn icon="trash" (click)="deleteFilling(item.id)" />
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  styleUrl: '../bd-styles.scss',
})
export class AlimentosComponent implements OnInit {
  protected fillings = signal<IFillingEditable[]>([]);

  private fb = inject(FormBuilder);

  form: FormGroup<IFillingForm> = this.fb.group<IFillingForm>(
    {} as IFillingForm
  );

  habilitarEditar(id: number | undefined): void {
    if (!id) return;
    this.fillings.update(items =>
      items.map(item => ({
        ...item,
        editMode: item.id === id,
      }))
    );
  }

  constructor(private readonly tacosService: TacosService) {}

  ngOnInit(): void {
    this.tacosService
      .getFillings()
      .subscribe((fillings: ITacoContent[] | null) => {
        if (!fillings) {
          console.log('error al obtener los fillings');
          return;
        }
        this.fillings.set(
          fillings.map(filling => ({
            ...filling,
            editMode: false,
          }))
        );
        this.form = this.fb.group<IFillingForm>({
          id: new FormControl<number>(0, {
            nonNullable: true,
          }),
          nombre: new FormControl<string>('', {
            nonNullable: true,
          }),
          precio: new FormControl<number>(0, {
            nonNullable: true,
          }),
        });
      });
  }

  saveEdit(item: ITacoContent, nuevoNombre: string, nuevoPrecio: string): void {
    item.nombre = nuevoNombre;
    item.precio = +nuevoPrecio;
    this.tacosService.editFilling(item).subscribe((filling: ITacoContent) => {
      this.fillings.update(items =>
        items.map(f => {
          if (f.id === filling.id) {
            return { ...f, ...filling, editMode: false };
          }
          return f;
        })
      );
    });
  }

  add(
    nombre: string,
    precio: string,
    inputNombre: HTMLInputElement,
    inputPrecio: HTMLInputElement
  ): void {
    const filling: Partial<ITacoContent> = {
      nombre: nombre,
      precio: +precio,
    };
    this.tacosService.addFilling(filling).subscribe((filling: ITacoContent) => {
      this.fillings.update(items => [
        { ...filling, editMode: false },
        ...items,
      ]);
      inputNombre.value = '';
      inputPrecio.value = '';
    });
  }

  deleteFilling(id: number | undefined): void {
    if (!id) return;
    console.log('hizo clic en delete');
    this.tacosService.deleteFilling(id).subscribe({
      next: () => {
        this.fillings.update(items => items.filter(f => f.id !== id));
      },
      error: (err: unknown) => {
        console.error('Error al eliminar el filling:', err);
      },
    });
  }
}
