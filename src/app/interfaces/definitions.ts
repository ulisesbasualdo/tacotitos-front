import { AbstractControl } from '@angular/forms';

export type TTortillaType = 'single' | 'double';

export type FormControlsOf<T> = {
  [K in keyof T]: AbstractControl<T[K]>;
};

export interface ITortillaEditable extends ITacoContent {
  editMode: boolean;
}

export interface IFillingEditable extends ITacoContent {
  editMode: boolean;
}

export interface ISauceEditable extends ITacoContent {
  editMode: boolean;
}

export interface ISelectMultiple extends ISelectSimple {
  selected: boolean;
}

export interface ISelectSimple {
  id: number;
  label: string;
  value: string;
  precio?: number;
}

export interface ITaco {
  id?: number;
  tortilla: ITacoContent;
  sauce?: ITacoContent;
  fillings: ITacoContent[];
  precio: number;
}

export interface ITacoStats {
  value: number | null;
  tortillaType: string | null;
  sauce: string | null;
  fillings: string[] | null;
}

export interface ITacoContent {
  id?: number;
  nombre: string;
  precio: number;
}
