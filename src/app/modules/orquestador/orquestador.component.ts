import { Component } from '@angular/core';
import { UIMainLayoutComponent } from '../../ui/layouts/main/main.component';
import { CardComponent } from '../../ui/molecules/card/card.component';
import { UIHeaderBarComponent } from '../../ui/organisms/header-bar/header-bar.component';
import { UiTabsGroupComponent, UiTabDirective } from '../../ui/features/tabs';
import { CrearTacoFormComponent } from '../tacos/crear-taco-form/crear-taco-form.component';
import { BdComponent } from '../tacos/bd/bd.component';
import { EstadisticasComponent } from '../tacos/estadisticas/estadisticas.component';

@Component({
  selector: 'app-orquestador',
  imports: [
    CardComponent,
    UIMainLayoutComponent,
    UIHeaderBarComponent,
    UiTabsGroupComponent,
    UiTabDirective,
    CrearTacoFormComponent,
    BdComponent,
    EstadisticasComponent,
  ],
  template: `
    <ui-main-layout>
      <div header>
        <ui-header-bar [barTitle]="'Tacotitos'" />
      </div>
      <div content>
        <ui-card width100>
          <div cardBody>
            <ui-tabs-group withFocusIndicator styleMinimalist>
              <ng-template uiTab="Crear Taco">
                <app-crear-taco-form />
              </ng-template>
              <ng-template uiTab="Estadísticas">
                <app-estadisticas />
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
export class OrquestadorComponent {}
