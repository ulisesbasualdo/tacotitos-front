import { Component } from '@angular/core';
import { OrquestadorComponent } from './modules/orquestador/orquestador.component';
import { Toaster } from './shared/components/toaster/toaster';

@Component({
  selector: 'app-root',
  imports: [OrquestadorComponent, Toaster],
  template: `
    <app-orquestador />
    <app-toaster />
  `,
  styles: ``,
})
export class AppComponent {}
