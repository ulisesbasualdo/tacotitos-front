import { Component } from '@angular/core';
import { BtnComponent } from '../../../../../ui/atoms/btn/btn.component';
import { IAlimentoEditable } from '../../../../../interfaces/definitions';

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
          <td><input type="text" placeholder="ingrese un nombre" /></td>
          <td>
            <input
              type="text"
              placeholder="ingrese un precio"
              class="text-right" />
          </td>
          <td><ui-btn icon="plus" /></td>
        </tr>
        @for (item of alimentos; track item.id; let i = $index) {
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
export class AlimentosComponent {
  public alimentos: IAlimentoEditable[] = [
    {
      id: 0,
      tipoAlimento: 'alimentoTortilla',
      nombre: 'carne',
      precio: 3,
      editMode: false,
    },
    {
      id: 1,
      tipoAlimento: 'alimentoTortilla',
      nombre: 'pollo',
      precio: 2.5,
      editMode: false,
    },
    {
      id: 2,
      tipoAlimento: 'alimentoTortilla',
      nombre: 'pescado',
      precio: 4,
      editMode: false,
    },
    {
      id: 3,
      tipoAlimento: 'alimentoTortilla',
      nombre: 'frijoles',
      precio: 1.5,
      editMode: false,
    },
    {
      id: 4,
      tipoAlimento: 'alimentoTortilla',
      nombre: 'queso',
      precio: 2,
      editMode: false,
    },
    {
      id: 5,
      tipoAlimento: 'alimentoTortilla',
      nombre: 'verduras',
      precio: 1.8,
      editMode: false,
    },
  ];

  habilitarEditar(id: number): void {
    this.alimentos.forEach(item => {
      if (item.id === id) {
        item.editMode = true;
      } else {
        item.editMode = false;
      }
    });
  }
}
