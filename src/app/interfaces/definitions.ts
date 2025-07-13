import { AbstractControl } from '@angular/forms';

export type TTipoAlimento = 'alimentoTortilla' | 'salsa';

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
export interface ITaco {
  tortilla: ITacoContent;
  salsa?: IAlimento;
  alimentos: IAlimento[];
  precio: number;
}
export interface ITacoContent {
  id: number;
  nombre: string;
  precio: number;
}

export interface IAlimento extends ITacoContent {
  tipoAlimento: TTipoAlimento;
}
