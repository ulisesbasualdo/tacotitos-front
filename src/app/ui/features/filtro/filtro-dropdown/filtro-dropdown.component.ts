import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IFiltro } from '../filtro.interface';
import { UIFiltroStoreService } from '../filtro-store.service';
import { IColleague } from '../../i-colleague';
import { Mediator } from '../../mediator.class';
import { MediatorService } from '../../mediator.service';
import { BtnComponent } from '../../../atoms/btn/btn.component';

@Component({
  selector: 'app-filtro-dropdown, ui-filtro-dropdown',
  standalone: true,
  imports: [BtnComponent],
  template: `
    @if (mostrar) {
      <div
        #filtroDropdownHTML
        id="filtroDropwdown"
        class="filtro-dropdown"
        (click)="detenerPropagacion($event)">
        @for (content of filtro.content; track $index) {
          <div class="contenido">
            <span> {{ filtro.key }}: {{ content.value }} </span>
            @if (appliedValue === content.value) {
              <app-btn
                [text]="'x'"
                [color]="'red'"
                [size]="'small'"
                (click)="limpiarFiltro(filtro)" />
            } @else {
              <app-btn
                [text]="'+'"
                [color]="'blue'"
                [size]="'small'"
                (click)="aplicarFiltro(filtro, content.value)" />
            }
          </div>
        }
        <div class="dropdown-footer">
          @if (filtro.estado === 'aplicado') {
            <app-btn
              [text]="'Limpiar filtro'"
              [color]="'red'"
              [size]="'small'"
              (click)="limpiarFiltro(filtro)" />
          } @else if (filtro.estado === 'sin-aplicar') {
            <app-btn
              [text]="'Limpiar filtro'"
              [color]="'blue'"
              [size]="'small'"
              [disabled]="true"
              (click)="limpiarFiltro(filtro)" />
          }
          <app-btn
            [text]="'Cerrar'"
            [color]="'default'"
            [size]="'small'"
            (click)="close()" />
        </div>
      </div>
    }
  `,
  styleUrl: './filtro-dropdown.component.scss',
})
export class UIFiltroDropdownComponent extends IColleague {
  @ViewChild('filtroDropdownHTML')
  filtroDropdownHTML!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) filtro!: IFiltro;
  public mostrar: boolean = false;

  @Output() filtroAplicado: EventEmitter<IFiltro> = new EventEmitter<IFiltro>();
  @Output() limpiar: EventEmitter<IFiltro> = new EventEmitter<IFiltro>();

  get appliedValue(): string | null {
    return this.filtro.appliedValue ?? null;
  }
  set appliedValue(value: string | null) {
    this.filtro.appliedValue = value;
  }
  // @Output()
  // public emititAbrir: EventEmitter<'abrir'> = new EventEmitter<'abrir'>();

  constructor(
    private readonly filtroStore: UIFiltroStoreService,
    private readonly elementRef: ElementRef,
    mediatorService: MediatorService
  ) {
    super(mediatorService.getMediator());
    // Registrarse como colega
    this.getMediator.addColleague(this);
  }

  public receive(message: string): void {
    if (message === 'abrir') {
      // Solo abrir si este es el dropdown actual
      const mediator = this.getMediator as Mediator;
      if (mediator.activeDropdown === this) {
        this.mostrar = true;
        mediator.isAnyDropdownOpen = true;
      } else {
        // Si no es el activo, asegurarse de que esté cerrado
        this.mostrar = false;
      }
    } else if (message === 'cerrar' || message === 'cerrar-todos') {
      if (this.mostrar) {
        this.mostrar = false;
        (this.getMediator as Mediator).isAnyDropdownOpen = false;
      }
    }
  }

  detenerPropagacion(event: MouseEvent): void {
    event.stopPropagation();
  }

  aplicarFiltro(filtro: IFiltro, value: string): void {
    const mediator = this.getMediator as Mediator;
    filtro.appliedValue = value;
    filtro.estado = 'aplicado';
    this.filtroStore.filtro = filtro;
    mediator.setParametros = [{ key: filtro.key, value: value }];
    console.log('Parametros actualizados:', mediator.getParametros);
    this.filtroAplicado.emit(filtro);
  }

  limpiarFiltro(filtro: IFiltro): void {
    const mediator = this.getMediator as Mediator;
    filtro.estado = 'sin-aplicar';
    this.filtroStore.filtro = filtro;
    mediator.eliminarParametro(filtro.key);
    console.log('Parametros actualizados:', mediator.getParametros);
    this.appliedValue = null;
    this.limpiar.emit(filtro);
  }

  clickFuera(event: MouseEvent): boolean {
    const elemento = this.elementRef.nativeElement;
    if (!this.mostrar || !elemento) {
      return true;
    }
    return !elemento.contains(event.target);
  }

  close(): void {
    const dropdown = this.filtroDropdownHTML;
    if (dropdown) {
      dropdown.nativeElement.classList.add('fade-out');
      setTimeout(() => {
        this.mostrar = false;
      }, 150); // Debe coincidir con la duración de la animación (0.3s = 300ms)
    }
    const mediator = this.getMediator as Mediator;
    mediator.send('cerrar', this);
  }
}
