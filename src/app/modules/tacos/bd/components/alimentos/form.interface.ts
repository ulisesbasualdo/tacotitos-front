import { FormControl } from '@angular/forms';
export interface IAlimentoForm {
  id: FormControl<string>;
  nombre: FormControl<string>;
  precio: FormControl<number>;
}
