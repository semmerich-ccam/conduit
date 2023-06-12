
// Based off the offline queue community link
import { ApolloLink, FetchResult, Operation } from '@apollo/client/link/core';
import { Observable, Observer } from '@apollo/client/utilities';


export class TestLink extends ApolloLink {
  public operations: Operation[];

  constructor() {
    super();
    this.operations = [];
  }

  public request(operation: Operation) {
    this.operations.push(operation);
    return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
      const operationContext = operation.getContext();
      if (operationContext['testError']) {
        // @ts-expect-error We know this will be defined
        setTimeout(() => observer.error(operationContext['testError']), 0);
        return;
      }
      if (operationContext['testResponse']) {
        // @ts-expect-error We know this will be defined
        setTimeout(() => observer.next(operationContext['testResponse']), 0);
        // @ts-expect-error We know this will be defined
        setTimeout(() => observer.complete(), 0);
      } else {
        throw new Error('Neither testError or testResponse');
      }
    });
  }
}

