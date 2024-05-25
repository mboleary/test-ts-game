import { Action, IocAdapter } from 'routing-controllers';
import { Container } from 'inversify';
import { ClassConstructor } from 'class-transformer';
import { API_SYMBOLS } from './symbol';

export class InversifyAdapter implements IocAdapter {
  constructor(private readonly container: Container) {}

  get<T>(someClass: ClassConstructor<T>, action?: Action): T {
    const childContainer = this.container.createChild();
    if (action?.context) {
      childContainer.bind(API_SYMBOLS.ClientIp).toConstantValue(action.context.ip);
    }
    return childContainer.resolve<T>(someClass);
  }
}
