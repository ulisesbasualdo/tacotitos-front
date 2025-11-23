import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { BtnComponent } from '../../../../../ui/atoms/btn/btn.component';
import {
  ITortillaEditable,
  ITacoContent,
} from '../../../../../interfaces/definitions';
import { TacosService } from '../../../../../services/data/tacos.service';
import { ToasterController } from '../../../../../shared/components/toaster/toaster-controller';

@Component({
  selector: 'app-tipo-tortilla',
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
              type="text"
              #inputNombreAgregar
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
                add(inputNombreAgregar.value, inputPrecioAgregar.value)
              " />
          </td>
        </tr>
        @if (tacosService.getTortillas.hasValue()) {
          @for (item of tiposTortilla(); track $index) {
            <tr>
              @if (!isEditing(item.id)) {
                <td>{{ item.name }}</td>
                <td>{{ item.price }}</td>
                <td>
                  <ui-btn (click)="putItemEditMode(item.id, true)" icon="pen" />
                  <ui-btn icon="save" />
                  <ui-btn icon="trash" (click)="deleteTortilla(item.id)" />
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
                  <ui-btn
                    (click)="putItemEditMode(item.id, false)"
                    icon="times" />
                  <ui-btn
                    icon="save"
                    (click)="
                      saveEdit(item, inputNombre.value, inputPrecio.value)
                    " />
                  <ui-btn icon="trash" (click)="deleteTortilla(item.id)" />
                </td>
              }
            </tr>
          }
        }
      </tbody>
    </table>
  `,
  styleUrl: '../bd-styles.scss',
})
export class TipoTortillaComponent implements AfterViewInit {
  protected readonly tacosService = inject(TacosService);
  private toasterController = inject(ToasterController);
  public tiposTortilla = signal<ITortillaEditable[]>([] as ITortillaEditable[]);

  habilitarEditar(id: number | undefined): void {
    if (!id) return;
    this.tiposTortilla().forEach(item => {
      if (item.id === id) {
        item.editMode = true;
      } else {
        item.editMode = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.tacosService.getTortillasObservable().subscribe({
      next: tortillas => {
        if (!tortillas) return;
        const tortillasWithEditMode = tortillas.map(tortilla => ({
          ...tortilla,
          editMode: false,
        }));
        this.tiposTortilla.set(tortillasWithEditMode);
      },
    });
  }

  add(nombre: string, precio: string): void {
    const tortilla: Partial<ITacoContent> = {
      name: nombre,
      price: +precio,
    };
    this.tacosService.addTortilla(tortilla).subscribe({
      next: tortillaCreada => {
        this.tiposTortilla.update(current => [
          { ...tortillaCreada, editMode: false },
          ...current,
        ]);
      },
    });
  }

  saveEdit(item: ITacoContent, nuevoNombre: string, nuevoPrecio: string): void {
    item.name = nuevoNombre;
    item.price = +nuevoPrecio;
    this.tacosService.editTortilla(item).subscribe((tortilla: ITacoContent) => {
      this.tiposTortilla.set(
        this.tiposTortilla().map(t => {
          if (t.id === tortilla.id) {
            return { ...t, ...tortilla, editMode: false };
          }
          return t;
        })
      );
    });
  }

  deleteTortilla(id: number | undefined): void {
    if (!id) return;
    console.log('hizo clic en delete');
    this.tacosService.deleteTortilla(id).subscribe({
      next: () => {
        this.tiposTortilla.set(this.tiposTortilla().filter(t => t.id !== id));
      },
      error: () => {
        this.toasterController.show(
          'Error',
          'Error al eliminar la tortilla',
          'info'
        );
      },
    });
  }

  isEditing(id: number | undefined): boolean {
    if (!id) return false;
    return this.tiposTortilla().some(item => item.id === id && item.editMode);
  }

  putItemEditMode(id: number | undefined, editMode: boolean): void {
    if (!id) return;
    this.tiposTortilla.update(items =>
      items.map(item => ({
        ...item,
        editMode: item.id === id && editMode,
      }))
    );
  }
}
