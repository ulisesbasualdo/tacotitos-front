import { IMediator } from './mediator.interface';

export abstract class IColleague {
  private readonly mediator: IMediator;
  public get getMediator(): IMediator {
    return this.mediator;
  }

  constructor(mediator: IMediator) {
    this.mediator = mediator;
  }

  public communicate(message: string): void {
    this.mediator.send(message, this);
  }
  public abstract receive(message: string): void;
}
