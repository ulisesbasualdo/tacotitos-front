import { Injectable } from '@angular/core';
import { Mediator } from './mediator.class';

@Injectable({
  providedIn: 'root',
})
export class MediatorService {
  private readonly mediator = new Mediator();

  getMediator(): Mediator {
    return this.mediator;
  }
}
