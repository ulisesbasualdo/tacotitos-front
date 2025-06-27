import { IAlimento } from './i-alimento';
import { ITacoContent } from './i-taco-content';

export interface ITaco {
  tortilla: ITacoContent;
  salsa?: IAlimento;

  getPrecioCosto?(): number;
}
