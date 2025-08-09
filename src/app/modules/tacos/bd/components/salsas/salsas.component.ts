import { Component, OnInit, signal } from '@angular/core';
import {
  IAlimento,
  IAlimentoEditable,
} from '../../../../../interfaces/definitions';
import { BtnComponent } from '../../../../../ui/atoms/btn/btn.component';
import { TacosService } from '../../../../../services/data/tacos.service';

@Component({
  selector: 'app-salsas',
  imports: [BtnComponent],
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
        @for (item of salsas(); track item.id) {
          <tr>
            @if (!item.editMode) {
              <td>{{ item.nombre }}</td>
              <td>{{ item.precio }}</td>
              <td>
                <ui-btn (click)="habilitarEditar(item.id)" icon="pen" />
                <ui-btn icon="save" />
                <ui-btn icon="trash" (click)="deleteSalsa(item.id)" />
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
                <ui-btn icon="trash" (click)="deleteSalsa(item.id)" />
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  styleUrl: '../bd-styles.scss',
})
export class SalsasComponent implements OnInit {
  protected salsas = signal<IAlimentoEditable[]>([]);

  habilitarEditar(id: string): void {
    this.salsas.update(items =>
      items.map(item => ({
        ...item,
        editMode: item.id === id,
      }))
    );
  }

  constructor(private readonly tacosService: TacosService) {}
  ngOnInit(): void {
    this.tacosService.getSalsas().subscribe((salsas: IAlimento[] | null) => {
      if (!salsas) {
        console.log('error al obtener las salsas');
        return;
      }
      this.salsas.set(
        salsas.map(salsa => ({
          ...salsa,
          editMode: false,
        }))
      );
    });
  }

  saveEdit(item: IAlimento, nuevoNombre: string, nuevoPrecio: string): void {
    item.nombre = nuevoNombre;
    item.precio = +nuevoPrecio;
    this.tacosService.editSalsa(item).subscribe((salsa: IAlimento) => {
      this.salsas.update(items =>
        items.map(s => {
          if (s.id === salsa.id) {
            return { ...s, ...salsa, editMode: false };
          }
          return s;
        })
      );
    });
  }

  add(
    nombre: string,
    precio: string,
    inputNombre: HTMLInputElement,
    inputPrecio: HTMLInputElement
  ) {
    const salsa: Partial<IAlimento> = {
      nombre: nombre,
      precio: +precio,
      tipoAlimento: 'salsa',
    };
    this.tacosService.addSalsa(salsa).subscribe(salsa => {
      this.salsas.update(items => [{ ...salsa, editMode: false }, ...items]);
      inputNombre.value = '';
      inputPrecio.value = '';
    });
  }

  deleteSalsa(id: string): void {
    console.log('hizo clic en delete');
    this.tacosService.deleteSalsa(id).subscribe({
      next: () => {
        this.salsas.update(items => items.filter(s => s.id !== id));
      },
      error: err => {
        console.error('Error al eliminar la salsa:', err);
      },
    });
  }
}
