import { Component } from '@angular/core';
import { CardComponent } from '../../../ui/molecules/card/card.component';
import { TipoTortillaComponent } from './components/tipo-tortilla/tipo-tortilla.component';
import { AlimentosComponent } from './components/alimentos/alimentos.component';
import { SalsasComponent } from './components/salsas/salsas.component';

@Component({
  selector: 'app-bd',
  imports: [
    CardComponent,
    TipoTortillaComponent,
    AlimentosComponent,
    SalsasComponent,
  ],
  template: `
    <ui-card titleText="Tipos de tortilla" width100 hasMarginTop>
      <div cardBody>
        <app-tipo-tortilla />
      </div>
    </ui-card>
    <ui-card titleText="Fillings" width100 hasMarginTop>
      <div cardBody>
        <app-fillings />
      </div>
    </ui-card>
    <ui-card titleText="Sauces" width100 hasMarginTop>
      <div cardBody>
        <app-sauces />
      </div>
    </ui-card>
  `,
  styles: ``,
})
export class BdComponent {}
