import { Component } from '@angular/core';
import { OrquestadorComponent } from './modules/orquestador/orquestador.component';

@Component({
  selector: 'app-root',
  imports: [OrquestadorComponent],
  template: ` <app-orquestador /> `,
  styles: ``,
})
export class AppComponent {}
