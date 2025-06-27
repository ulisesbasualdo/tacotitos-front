import { IColleague } from './i-colleague';

export interface IMediator {
  addColleague(colleague: IColleague): void;
  send(message: string, iColleague: IColleague): void;
}
