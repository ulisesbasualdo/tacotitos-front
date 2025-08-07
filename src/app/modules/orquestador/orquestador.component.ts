import { Component } from '@angular/core';
import { UIMainLayoutComponent } from '../../ui/layouts/main/main.component';
import { CardComponent } from '../../ui/molecules/card/card.component';
import { UIHeaderBarComponent } from '../../ui/organisms/header-bar/header-bar.component';
import { CrearTacoFormComponent } from '../tacos/crear-taco-form/crear-taco-form.component';
import { BdComponent } from '../tacos/bd/bd.component';
import { EstadisticasComponent } from '../tacos/estadisticas/estadisticas.component';
import { UiTabDirective, UiTabsGroupComponent } from '../../ui/features/tabs';

@Component({
  selector: 'app-orquestador',
  imports: [
    CardComponent,
    UIMainLayoutComponent,
    UIHeaderBarComponent,
    CrearTacoFormComponent,
    BdComponent,
    EstadisticasComponent,
    UiTabsGroupComponent,
    UiTabDirective,
  ],
  template: `
    <!-- Templates para cada tab -->
    <ui-main-layout>
      <div header>
        <ui-header-bar [barTitle]="'Tacotitos'" />
      </div>
      <div content>
        <ui-card width100>
          <div cardBody>
            <ui-tabs-group withFocusIndicator animationType="slide">
              <ng-template uiTab="Crear Taco">
                <app-crear-taco-form />
              </ng-template>
              <ng-template uiTab="Estadísticas">
                <ui-card width100 titleText="Estadísticas">
                  <div cardBody>
                    <app-estadisticas />
                  </div>
                </ui-card>
              </ng-template>
              <ng-template uiTab="Base de Tacos">
                <ui-card width100 titleText="Base de Datos">
                  <div cardBody>
                    <app-bd />
                  </div>
                </ui-card>
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
