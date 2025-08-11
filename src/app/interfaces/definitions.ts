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
  id: string;
  label: string;
  value: string;
  precio?: number;
}
export interface ITaco {
  tortilla: ITacoContent;
  salsa?: IAlimento;
  alimentos: IAlimento[];
  precio: number;
}

export interface ITacoStats {
  valor: number | null;
  tipoTortilla: string | null;
  salsa: string | null;
  alimentos: string[] | null;
}

export interface ITacoContent {
  id: string;
  nombre: string;
  precio: number;
}

export interface IAlimento extends ITacoContent {
  tipoAlimento: TTipoAlimento;
}
