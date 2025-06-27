import { ITacoContent } from './i-taco-content';

export type TTipoAlimento = 'alimentoTortilla' | 'salsa';

export interface IAlimento extends ITacoContent {
  tipoAlimento: TTipoAlimento;
}
