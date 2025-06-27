import { AbstractControl } from '@angular/forms';

export type FormControlsOf<T> = {
  [K in keyof T]: AbstractControl<T[K]>;
};
