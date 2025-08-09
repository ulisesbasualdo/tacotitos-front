import { Component, OnInit, signal } from '@angular/core';
import { BtnComponent } from '../../../../../ui/atoms/btn/btn.component';
import {
  IAlimento,
  IAlimentoEditable,
} from '../../../../../interfaces/definitions';
import { TacosService } from '../../../../../services/data/tacos.service';

@Component({
  selector: 'app-alimentos',
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
        @for (item of alimentos(); track item.id) {
          <tr>
            @if (!item.editMode) {
              <td>{{ item.nombre }}</td>
              <td>{{ item.precio }}</td>
              <td>
                <ui-btn (click)="habilitarEditar(item.id)" icon="pen" />
                <ui-btn icon="save" />
                <ui-btn icon="trash" (click)="deleteAlimento(item.id)" />
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
                <ui-btn icon="trash" (click)="deleteAlimento(item.id)" />
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
  protected alimentos = signal<IAlimentoEditable[]>([]);

  habilitarEditar(id: string): void {
    this.alimentos.update(items =>
      items.map(item => ({
        ...item,
        editMode: item.id === id,
      }))
    );
  }
  constructor(private readonly tacosService: TacosService) {}
  ngOnInit(): void {
    this.tacosService
      .getAlimentos()
      .subscribe((alimentos: IAlimento[] | null) => {
        if (!alimentos) {
          console.log('error al obtener las salsas');
          return;
        }
        this.alimentos.set(
          alimentos.map(alimento => ({
            ...alimento,
            editMode: false,
          }))
        );
      });
  }
  saveEdit(item: IAlimento, nuevoNombre: string, nuevoPrecio: string): void {
    item.nombre = nuevoNombre;
    item.precio = +nuevoPrecio;
    this.tacosService.editAlimento(item).subscribe((alimento: IAlimento) => {
      this.alimentos.update(items =>
        items.map(a => {
          if (a.id === alimento.id) {
            return { ...a, ...alimento, editMode: false };
          }
          return a;
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
    const alimento: Partial<IAlimento> = {
      nombre: nombre,
      precio: +precio,
      tipoAlimento: 'alimentoTortilla',
    };
    this.tacosService.addAlimento(alimento).subscribe(alimento => {
      this.alimentos.update(items => [
        { ...alimento, editMode: false },
        ...items,
      ]);
      inputNombre.value = '';
      inputPrecio.value = '';
    });
  }

  deleteAlimento(id: string): void {
    console.log('hizo clic en delete');
    this.tacosService.deleteAlimento(id).subscribe({
      next: () => {
        this.alimentos.update(items => items.filter(a => a.id !== id));
      },
      error: err => {
        console.error('Error al eliminar el alimento:', err);
      },
    });
  }
}
