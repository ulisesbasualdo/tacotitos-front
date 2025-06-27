import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { IFiltro } from './filtro.interface';
import { UIFiltroDropdownComponent } from './filtro-dropdown/filtro-dropdown.component';
import { IColleague } from '../i-colleague';
import { Mediator } from '../mediator.class';
import { MediatorService } from '../mediator.service';
import { BtnComponent } from '../../atoms/btn/btn.component';

@Component({
  selector: 'app-filtro, ui-filtro',
  standalone: true,
  imports: [UIFiltroDropdownComponent, BtnComponent],
  template: `
    @if (filtro) {
      @switch (filtro.estado) {
        @case ('aplicado') {
          <app-btn
            [text]="filtro.key"
            [color]="'green'"
            (click)="abrirCerrarDropdown(filtroDropdown, $event)">
          </app-btn>
        }
        @case ('sin-aplicar') {
          <app-btn
            [text]="filtro.key"
            [color]="'blue'"
            (click)="abrirCerrarDropdown(filtroDropdown, $event)">
          </app-btn>
        }
      }
      <ui-filtro-dropdown
        #filtroDropdown
        [filtro]="filtro"
        (limpiar)="clean.emit($event)"
        (filtroAplicado)="cambio.emit($event)" />
    }
  `,
  styles: `
    .filtro-aplicado {
      background-color: #d4edda;
      color: #155724;
      padding: 0.5em;
      border-radius: 0.25em;
      border: 1px solid #c3e6cb;
      cursor: pointer;
    }
    .filtro-sin-aplicar {
      background-color: #f8d7da;
      color: #721c24;
      padding: 0.5em;
      border-radius: 0.25em;
      border: 1px solid #f5c6cb;
      cursor: pointer;
    }
    .filtro-aplicado:hover,
    .filtro-sin-aplicar:hover {
      background-color: #e2e3e5;
      color: #383d41;
      border-color: #b8c2cc;
      cursor: pointer;
    }
    .filtro-aplicado span,
    .filtro-sin-aplicar span {
      font-weight: bold;
      margin-right: 0.5em;
    }
    .filtro-aplicado button,
    .filtro-sin-aplicar button {
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      cursor: pointer;
      padding: 0;
      outline: inherit;
    }
    .filtro-aplicado button:hover,
    .filtro-sin-aplicar button:hover {
      color: #0056b3;
    }
  `,
})
export class UIFiltroComponent extends IColleague {
  @ViewChild('filtroDropdown', { read: UIFiltroDropdownComponent })
  filtroDropdownComponent!: UIFiltroDropdownComponent;
  @ViewChild('filtroDropdown')
  filtroDropdownInHTML!: ElementRef<UIFiltroDropdownComponent>;
  @Input({ required: true }) filtro!: IFiltro;
  @Output() cambio: EventEmitter<IFiltro> = new EventEmitter();
  @Output() clean: EventEmitter<IFiltro> = new EventEmitter();

  mostrarDropdown: boolean = false;

  constructor(
    mediatorService: MediatorService,
    private readonly elementRef: ElementRef
  ) {
    super(mediatorService.getMediator());
    // Registrarse como colega
    this.getMediator.addColleague(this);
  }

  public receive(message: string): void {
    console.log('Recibiendo mensaje en el dropdown', message);
  }

  abrirCerrarDropdown(
    filtroDropdown: UIFiltroDropdownComponent,
    event?: MouseEvent
  ): void {
    if (event) {
      event.stopPropagation();
    }

    (this.getMediator as Mediator).activeDropdown = filtroDropdown;
    this.getMediator.send('abrir', this);
  }

  @HostListener('document:click', ['$event'])
  clickFueraDelDropdown(event: MouseEvent): void {
    const mediator = this.getMediator as Mediator;

    if (this.filtroDropdownComponent && this.filtroDropdownComponent.mostrar) {
      const clicDentroDelDropdown =
        !this.filtroDropdownComponent.clickFuera(event);
      if (clicDentroDelDropdown) {
        event.stopPropagation();
        return;
      }
    }

    // Verificar si el clic fue dentro del botón del filtro
    if (this.elementRef.nativeElement.contains(event.target)) {
      event.stopPropagation();
      return;
    }

    // Solo aquí si el clic fue fuera del dropdown y fuera del botón
    if (mediator.isAnyDropdownOpen) {
      mediator.send('cerrar-todos', this);
    }
  }
}
