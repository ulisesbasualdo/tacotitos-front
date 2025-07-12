import { AbstractControl } from '@angular/forms';
import { ITacoContent } from './i-taco-content';
import { IAlimento } from './i-alimento';

export type FormControlsOf<T> = {
  [K in keyof T]: AbstractControl<T[K]>;
};

export interface ITortillaEditable extends ITacoContent {
  editMode: boolean;
}
export interface IAlimentoEditable extends IAlimento {
  editMode: boolean;
}

export interface ISelectMultiple extends ISelectSimple {
  selected: boolean;
}

export interface ISelectSimple {
  id: number;
  label: string;
  value: string;
}
