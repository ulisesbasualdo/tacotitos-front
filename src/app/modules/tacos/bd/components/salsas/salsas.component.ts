import { Component, OnInit, signal } from '@angular/core';
import {
  ISauceEditable,
  ITacoContent,
} from '../../../../../interfaces/definitions';
import { BtnComponent } from '../../../../../ui/atoms/btn/btn.component';
import { TacosService } from '../../../../../services/data/tacos.service';

@Component({
  selector: 'app-sauces',
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
        @for (item of sauces(); track item.id) {
          <tr>
            @if (!item.editMode) {
              <td>{{ item.name }}</td>
              <td>{{ item.price }}</td>
              <td>
                <ui-btn (click)="habilitarEditar(item.id)" icon="pen" />
                <ui-btn icon="save" />
                <ui-btn icon="trash" (click)="deleteSauce(item.id)" />
              </td>
            } @else {
              <td>
                <input
                  #inputNombre
                  type="text"
                  placeholder="ingrese un nombre"
                  [value]="item.name" />
              </td>
              <td>
                <input
                  #inputPrecio
                  type="text"
                  placeholder="ingrese un precio"
                  class="text-right"
                  [value]="item.price" />
              </td>
              <td>
                <ui-btn (click)="item.editMode = false" icon="times" />
                <ui-btn
                  icon="save"
                  (click)="
                    saveEdit(item, inputNombre.value, inputPrecio.value)
                  " />
                <ui-btn icon="trash" (click)="deleteSauce(item.id)" />
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
  protected sauces = signal<ISauceEditable[]>([]);

  habilitarEditar(id: number | undefined): void {
    if (!id) return;
    this.sauces.update(items =>
      items.map(item => ({
        ...item,
        editMode: item.id === id,
      }))
    );
  }

  constructor(private readonly tacosService: TacosService) {}

  ngOnInit(): void {
    this.tacosService.getSauces().subscribe((sauces: ITacoContent[] | null) => {
      if (!sauces) {
        console.log('error al obtener las sauces');
        return;
      }
      this.sauces.set(
        sauces.map(sauce => ({
          ...sauce,
          editMode: false,
        }))
      );
    });
  }

  saveEdit(item: ITacoContent, nuevoNombre: string, nuevoPrecio: string): void {
    item.name = nuevoNombre;
    item.price = +nuevoPrecio;
    this.tacosService.editSauce(item).subscribe((sauce: ITacoContent) => {
      this.sauces.update(items =>
        items.map(s => {
          if (s.id === sauce.id) {
            return { ...s, ...sauce, editMode: false };
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
  ): void {
    const sauce: Partial<ITacoContent> = {
      name: nombre,
      price: +precio,
    };
    this.tacosService.addSauce(sauce).subscribe((sauce: ITacoContent) => {
      this.sauces.update(items => [{ ...sauce, editMode: false }, ...items]);
      inputNombre.value = '';
      inputPrecio.value = '';
    });
  }

  deleteSauce(id: number | undefined): void {
    if (!id) return;
    console.log('hizo clic en delete');
    this.tacosService.deleteSauce(id).subscribe({
      next: () => {
        this.sauces.update(items => items.filter(s => s.id !== id));
      },
      error: (err: unknown) => {
        console.error('Error al eliminar la sauce:', err);
      },
    });
  }
}
