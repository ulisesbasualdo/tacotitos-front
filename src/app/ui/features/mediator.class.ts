import { UIFiltroDropdownComponent } from './filtro/filtro-dropdown/filtro-dropdown.component';
import { IColleague } from './i-colleague';
import { IMediator } from './mediator.interface';

export interface IFiltroKeyValue {
  key: string;
  value: string;
}

export interface IDropdownComponent {
  isOpen?: () => boolean;
  close?: () => void;
}

export type DropdownComponent = UIFiltroDropdownComponent | IDropdownComponent;

export class Mediator implements IMediator {
  private readonly _colleagues: IColleague[];
  private _activeDropdown: DropdownComponent | null = null;
  private _isAnyDropdownOpen: boolean = false;
  private readonly _endpoint: string = 'http://localhost:3000/filtros';
  private readonly _parametros: IFiltroKeyValue[] = [];

  get getParametros(): IFiltroKeyValue[] {
    return this._parametros;
  }
  set setParametros(parametros: IFiltroKeyValue[]) {
    parametros.forEach(nuevoParametro => {
      // Busca si ya existe un parámetro con la misma key
      const existingIndex = this._parametros.findIndex(
        p => p.key === nuevoParametro.key
      );

      if (existingIndex !== -1) {
        // Si existe, reemplaza el valor
        this._parametros[existingIndex] = nuevoParametro;
      } else {
        // Si no existe, agrega como nuevo
        this._parametros.push(nuevoParametro);
      }
    });
  }

  get endpoint(): string {
    return this._endpoint;
  }
  get activeDropdown(): DropdownComponent | null {
    return this._activeDropdown;
  }
  set activeDropdown(dropdown: DropdownComponent | null) {
    this._activeDropdown = dropdown;
  }
  constructor() {
    this._colleagues = new Array<IColleague>();
  }

  get isAnyDropdownOpen(): boolean {
    return this._isAnyDropdownOpen;
  }
  set isAnyDropdownOpen(value: boolean) {
    this._isAnyDropdownOpen = value;
  }

  public addColleague(colleague: IColleague): void {
    this._colleagues.push(colleague);
  }

  eliminarParametro(key: string): void {
    const index = this._parametros.findIndex(param => param.key === key);
    if (index !== -1) {
      this._parametros.splice(index, 1);
    }
  }

  send(message: string, iColleague: IColleague): void {
    for (const colleague of this._colleagues) {
      if (colleague !== iColleague) {
        colleague.receive(message);
      }
    }
  }
}
