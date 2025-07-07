import { Component } from '@angular/core';
import { CardComponent } from '../../../ui/molecules/card/card.component';
import { BtnComponent } from '../../../ui/atoms/btn/btn.component';
import { TortillaEditable } from '../../../interfaces/definitions';

@Component({
  selector: 'app-bd',
  imports: [CardComponent, BtnComponent],
  template: `
    <ui-card titleText="Base de Datos" width100>
      <div cardBody>
        <h2>Tipos de Tortilla</h2>
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
            @for (item of tiposTortilla; track item.id; let i = $index) {
              <tr>
                @if (!item.editMode) {
                  <td>{{ item.nombre }}</td>
                  <td>{{ item.getPrecioCosto() }}</td>
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
      </div>
    </ui-card>
  `,
  styles: ``,
})
export class BdComponent {
  public tiposTortilla: TortillaEditable[] = [
    {
      id: 0,
      nombre: 'nogal',
      precio: 2,
      getPrecioCosto() {
        return this.precio;
      },
      editMode: false,
    },
    {
      id: 1,
      nombre: 'avena',
      precio: 4.5,
      getPrecioCosto() {
        return this.precio;
      },
      editMode: false,
    },
    {
      id: 2,
      nombre: 'avena',
      precio: 4.5,
      getPrecioCosto() {
        return this.precio;
      },
      editMode: false,
    },
    {
      id: 3,
      nombre: 'avena',
      precio: 4.5,
      getPrecioCosto() {
        return this.precio;
      },
      editMode: false,
    },
  ];

  habilitarEditar(id: number): void {
    this.tiposTortilla.forEach(item => {
      if (item.id === id) {
        item.editMode = true;
      } else {
        item.editMode = false;
      }
    });
  }
}
