export interface IContent {
  id: string;
  value: string;
}

export interface IFiltroResponse {
  key: string;
  content: IContent[];
}

export interface IFiltro extends IFiltroResponse {
  estado: 'aplicado' | 'sin-aplicar';
  appliedValue: string | null;
}
