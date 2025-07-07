import { Component, signal, ViewChild } from '@angular/core';
import { UIModalComponent } from '../../ui/features/modal/modal.component';
import { UIMainLayoutComponent } from '../../ui/layouts/main/main.component';
import { CardComponent } from '../../ui/molecules/card/card.component';
import {
  IMenuItem,
  UIHeaderBarComponent,
} from '../../ui/organisms/header-bar/header-bar.component';
import { ITaco } from '../../interfaces/i-taco';
import { TacosService } from '../../services/data/tacos.service';
import { UiTabsGroupComponent, UiTabDirective } from '../../ui/features/tabs';
import { CrearTacoFormComponent } from '../tacos/crear-taco-form/crear-taco-form.component';
import { ChipsDemoComponent } from '../../ui/features/select-multiple-chips/chips-demo.component';
import { BdComponent } from '../tacos/bd/bd.component';

@Component({
  selector: 'app-orquestador',
  imports: [
    CardComponent,
    UIMainLayoutComponent,
    UIHeaderBarComponent,
    UiTabsGroupComponent,
    UiTabDirective,
    CrearTacoFormComponent,
    ChipsDemoComponent,
    BdComponent,
  ],
  template: `
    <ui-main-layout>
      <div header>
        <ui-header-bar [barTitle]="'Tacotitos'" />
      </div>
      <!--<div content>
        <ui-card
          [titleText]="'Welcome to Tacotitos!'"
          [subtitle]="'Your favorite taco place'">
          <div cardBody>
            <p>{{ datosEnContenido }}</p>
            <p>¡Disfruta de nuestros deliciosos tacos!</p>
          </div>
          <div cardFooter>
            <ui-btn-group-layout [align]="'left'" [gap]="'large'">
              <ui-btn
                [text]="'Order Now!'"
                [color]="'blue'"
                [size]="'small'"
                (clickEvent)="datosEnContenido = '¡Tacos ordenados!'" />
              <ui-btn
                [text]="'Obtener económico'"
                [color]="'green'"
                [size]="'small'"
                (clickEvent)="obtenerBarato()" />

              <ui-btn
                [text]="'Crear Taco'"
                [color]="'bgGrayTxtBlue'"
                [size]="'small'"
                (clickEvent)="uiModalHTML.open()" />
            </ui-btn-group-layout>
          </div>
        </ui-card>
      </div>
    </ui-main-layout>
    <ui-modal #uiModalHTML [titleText]="'Crear Taco'">
      <app-crear-taco-form (submitTaco)="this.crearTaco($event)" />
    </ui-modal>

    <ui-main-layout>
      <div header>
  </div> -->
      <div content>
        <ui-card width100>
          <div cardBody>
            <ui-tabs-group withFocusIndicator styleMinimalist>
              <ng-template uiTab="Crear Taco">
                <app-crear-taco-form />
              </ng-template>
              <ng-template uiTab="Selector de Chips">
                <app-chips-demo />
              </ng-template>
              <ng-template uiTab="Estadísticas">
                <p>Contenido del Tab 2</p>
              </ng-template>
              <ng-template uiTab="Base de Tacos">
                <app-bd />
              </ng-template>
            </ui-tabs-group>
          </div>
        </ui-card>
      </div>
    </ui-main-layout>
  `,
  styles: ``,
})
export class OrquestadorComponent {
  @ViewChild('uiModalHTML')
  uiModalHTML!: UIModalComponent;

  title = 'tacotitos';

  private _tacoMasEconomico: ITaco | null = null;
  get tacoMasEconomico(): ITaco | null {
    return this._tacoMasEconomico;
  }
  set tacoMasEconomico(value: ITaco) {
    this._tacoMasEconomico = value;
  }

  protected menuItems = signal<IMenuItem[]>([
    { id: 1, label: 'obtener barato', action: () => this.obtenerBarato() },
    { id: 2, label: 'obtener costoso', action: () => this.obtenerCostoso() },
    {
      id: 3,
      label: 'obtener valor promedio',
      action: () => this.obtenerPromedio(),
    },
  ]);

  private readonly _datosEnContenido = signal<string>('esperando datos...');
  get datosEnContenido() {
    return this._datosEnContenido();
  }
  set datosEnContenido(value: string) {
    this._datosEnContenido.set(value);
  }

  constructor(private readonly tacosService: TacosService) {}

  obtenerBarato() {
    this.datosEnContenido = 'Obteniendo datos baratos...';

    this.tacosService.getTacoMasEconomico().subscribe({
      next: taco => {
        this.tacoMasEconomico = taco;
        this.datosEnContenido =
          'el taco más económico es: ' + JSON.stringify(taco);
      },
      error: error => {
        console.error('Error al obtener el taco más económico:', error);
        this.datosEnContenido = 'Error al obtener el taco más económico.';
      },
    });
  }

  obtenerCostoso() {
    this.datosEnContenido = 'Obteniendo datos costosos...';
    this.tacosService.getTacoMasCostoso().subscribe({
      next: taco => {
        this.datosEnContenido =
          'el taco más costoso es: ' + JSON.stringify(taco);
      },
      error: error => {
        console.error('Error al obtener el taco más costoso:', error);
        this.datosEnContenido = 'Error al obtener el taco más costoso.';
      },
    });
  }

  obtenerPromedio() {
    this.datosEnContenido = 'Obteniendo valor promedio...';
    this.tacosService.getValorPromedio().subscribe({
      next: promedio => {
        this.datosEnContenido =
          'El valor promedio de los tacos es: ' + promedio;
      },
      error: error => {
        console.error('Error al obtener el valor promedio:', error);
        this.datosEnContenido = 'Error al obtener el valor promedio.';
      },
    });
  }

  crearTaco(taco: ITaco) {
    this.tacosService.createTaco(taco).subscribe({
      next: createdTaco => {
        this.datosEnContenido = 'Taco creado: ' + JSON.stringify(createdTaco);
      },
      error: error => {
        console.error('Error al crear el taco:', error);
        this.datosEnContenido = 'Error al crear el taco.';
        this.uiModalHTML.close();
      },
      complete: () => {
        this.uiModalHTML.close();
      },
    });
  }
}
