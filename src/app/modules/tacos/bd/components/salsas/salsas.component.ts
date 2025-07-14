import { Component, OnInit } from '@angular/core';
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
          <td><input type="text" placeholder="ingrese un nombre" /></td>
          <td>
            <input
              type="text"
              placeholder="ingrese un precio"
              class="text-right" />
          </td>
          <td><ui-btn icon="plus" /></td>
        </tr>
        @for (item of salsas; track item.id) {
          <tr>
            @if (!item.editMode) {
              <td>{{ item.nombre }}</td>
              <td>{{ item.precio }}</td>
              <td>
                <ui-btn (click)="habilitarEditar(item.id)" icon="pen" />
                <ui-btn icon="save" /> <ui-btn icon="trash" />
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
                <ui-btn icon="trash" />
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
  protected salsas: IAlimentoEditable[] = [];

  habilitarEditar(id: number): void {
    this.salsas?.forEach(item => {
      if (item.id === id) {
        item.editMode = true;
      } else {
        item.editMode = false;
      }
    });
  }

  constructor(private readonly tacosService: TacosService) {}
  ngOnInit(): void {
    this.tacosService.getSalsas().subscribe((salsas: IAlimento[] | null) => {
      if (!salsas) {
        console.log('error al obtener las salsas');
        return;
      }
      for (const salsa of salsas) {
        this.salsas?.push({
          ...salsa,
          editMode: false,
        });
      }
    });
  }

  saveEdit(item: IAlimento, nuevoNombre: string, nuevoPrecio: string): void {
    item.nombre = nuevoNombre;
    item.precio = +nuevoPrecio;
    this.tacosService.editSalsa(item).subscribe((salsa: IAlimento) => {
      this.salsas = this.salsas.map(s => {
        if (s.id === salsa.id) {
          return { ...s, ...salsa, editMode: false };
        }
        return s;
      });
    });
  }
}
