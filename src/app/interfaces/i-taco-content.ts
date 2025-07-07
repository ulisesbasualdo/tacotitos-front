export interface ITacoContent {
  id?: number;
  nombre: string;
  precio: number;
  getPrecioCosto(): number;
}
