import { Component } from '@angular/core';
import { IAlimentoEditable } from '../../../../../interfaces/definitions';
import { BtnComponent } from '../../../../../ui/atoms/btn/btn.component';

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
          <td><input type="text" placeholder="ingrese un nombre" /></td>
          <td>
            <input
              type="text"
              placeholder="ingrese un precio"
              class="text-right" />
          </td>
          <td><ui-btn icon="plus" /></td>
        </tr>
        @for (item of salsas; track item.id; let i = $index) {
          <tr>
            @if (!item.editMode) {
              <td>{{ item.nombre }}</td>
              <td>{{ item.precio }}</td>
              <td>
                <ui-btn (click)="habilitarEditar(i)" icon="pen" />
                <ui-btn icon="save" /> <ui-btn icon="trash" />
              </td>
            } @else {
              <td>
                <input
                  type="text"
                  placeholder="ingrese un nombre"
                  [value]="item.nombre" />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="ingrese un precio"
                  class="text-right"
                  [value]="item.precio" />
              </td>
              <td>
                <ui-btn (click)="item.editMode = false" icon="times" />
                <ui-btn icon="save" /> <ui-btn icon="trash" />
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
  styleUrl: '../bd-styles.scss',
})
export class SalsasComponent {
  public salsas: IAlimentoEditable[] = [
    {
      id: 0,
      tipoAlimento: 'salsa',
      nombre: 'tomate',
      precio: 2,
      editMode: false,
    },
    {
      id: 1,
      tipoAlimento: 'salsa',
      nombre: 'cheddar',
      precio: 4.5,
      editMode: false,
    },
    {
      id: 2,
      tipoAlimento: 'salsa',
      nombre: 'blanca',
      precio: 4.5,
      editMode: false,
    },
    {
      id: 3,
      tipoAlimento: 'salsa',
      nombre: 'golf',
      precio: 4.5,
      editMode: false,
    },
  ];

  habilitarEditar(id: number): void {
    this.salsas.forEach(item => {
      if (item.id === id) {
        item.editMode = true;
      } else {
        item.editMode = false;
      }
    });
  }
}
