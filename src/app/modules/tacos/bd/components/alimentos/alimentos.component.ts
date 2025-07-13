import { Component, OnInit } from '@angular/core';
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
          <td><input type="text" placeholder="ingrese un nombre" /></td>
          <td>
            <input
              type="text"
              placeholder="ingrese un precio"
              class="text-right" />
          </td>
          <td><ui-btn icon="plus" /></td>
        </tr>
        @for (item of alimentos; track item.id) {
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
export class AlimentosComponent implements OnInit {
  public alimentos: IAlimentoEditable[] = [];

  habilitarEditar(id: number): void {
    this.alimentos.forEach(item => {
      if (item.id === id) {
        item.editMode = true;
      } else {
        item.editMode = false;
      }
    });
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
        for (const alimento of alimentos) {
          this.alimentos?.push({
            ...alimento,
            editMode: false,
          });
        }
      });
  }
}
