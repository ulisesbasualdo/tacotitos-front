import { AbstractControl } from '@angular/forms';
import { ITacoContent } from './i-taco-content';

export type FormControlsOf<T> = {
  [K in keyof T]: AbstractControl<T[K]>;
};

export interface TortillaEditable extends ITacoContent {
  editMode: boolean;
}
