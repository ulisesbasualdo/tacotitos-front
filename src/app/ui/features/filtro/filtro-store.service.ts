import { Injectable, signal } from '@angular/core';
import { IFiltro } from './filtro.interface';

@Injectable({
  providedIn: 'root',
})
export class UIFiltroStoreService {
  private readonly _filtros = signal<IFiltro[]>([]);
  set filtros(filtros: IFiltro[]) {
    this._filtros.set(filtros);
  }
  set filtro(filtroArgumento: IFiltro) {
    this.filtros.forEach(filtro => {
      if (filtro.key === filtroArgumento.key) {
        if (filtro.estado !== filtroArgumento.estado) {
          filtro.estado = filtroArgumento.estado;
        }
      }
    });
  }
  get filtros(): IFiltro[] {
    return this._filtros();
  }

  private readonly _filtrosAplicados = signal<IFiltro[] | null>(null);
  set filtrosAplicados(filtrosAplicados: IFiltro[] | null) {
    this._filtrosAplicados.set(filtrosAplicados);
  }
  get filtrosAplicados(): IFiltro[] | null {
    return this._filtrosAplicados();
  }
}
