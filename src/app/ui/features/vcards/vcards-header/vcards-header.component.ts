import {
  AfterContentChecked,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChildren,
} from '@angular/core';
import { UIFiltroComponent } from '../../filtro/filtro.component';
import { IFiltro } from '../../filtro/filtro.interface';
import { UIFiltroStoreService } from '../../filtro/filtro-store.service';
import { UIFiltroDropdownComponent } from '../../filtro/filtro-dropdown/filtro-dropdown.component';

@Component({
  selector: 'app-vcards-header, ui-vcards-header',
  standalone: true,
  imports: [UIFiltroComponent],
  template: `
    <div class="ui-vcards-header-container">
      <div class="ui-vcards-header-contenido">
        @if (filtrosDeStore) {
          @for (filtro of filtrosDeStore; track filtro) {
            <ui-filtro
              [filtro]="filtro"
              (cambio)="emitirCambios(filtro)"
              (clean)="limpiarFiltro(filtro)" />
          }
        }
        <ng-content select="[primaryActions]" />
      </div>
    </div>
  `,
  styles: `
    .vcards-header-container {
      width: 100%;
      align-items: center;
      padding: 1em;
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      gap: 0.5em;
      margin-bottom: 1em;
    }
    .ui-vcards-header-contenido {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
      align-items: center;
      justify-content: center;
    }
  `,
})
export class UIVCardsHeaderComponent implements AfterContentChecked {
  @Input() filtros!: IFiltro[];
  @Output() cambio: EventEmitter<IFiltro[]> = new EventEmitter<IFiltro[]>();
  @Output() clean: EventEmitter<IFiltro[]> = new EventEmitter<IFiltro[]>();

  @ViewChildren('filtroDropdown') filtroDropdowns!: UIFiltroDropdownComponent[];

  private vistaIniciada: boolean = false; // Para evitar que se emita el evento antes de que la vista esté lista

  //revisar qué filtros hay ya aplicados y luego emitirlos

  get filtrosDeStore(): IFiltro[] {
    return this.filtroStore.filtros;
  }

  constructor(private readonly filtroStore: UIFiltroStoreService) {}

  ngAfterContentChecked(): void {
    if (this.vistaIniciada) {
      return;
    }
    if (this.filtros) {
      this.filtroStore.filtros = this.filtros;
      this.vistaIniciada = true;
    }
  }

  emitirCambios(filtro: IFiltro): void {
    // agregar a la signal<IFiltro[]> del servicio store el filtro que se ha cambiado
    this.filtroStore.filtro = filtro;
    this.cambio.emit(this.filtroStore.filtros);
  }
  limpiarFiltro(filtro: IFiltro): void {
    // agregar a la signal<IFiltro[]> del servicio store el filtro que se ha cambiado
    this.filtroStore.filtro = filtro;
    this.clean.emit(this.filtroStore.filtros);
  }
}
