import {
  ApolloLink,
  Operation,
  FetchResult,
  NextLink,
} from '@apollo/client/link/core';
import {
  Observable,
  Observer,
} from '@apollo/client/utilities';

// For now we care only about mutations that edit
// How do we determine that its an edit
interface OperationQueueEntry {
  operation: Operation;
  forward: NextLink;
  observer: Observer<FetchResult>;
  subscription?: { unsubscribe: () => void };
}

export default class OfflineQueueLink extends ApolloLink {
  private opQueue: Set<OperationQueueEntry> = new Set();
  private isOpen = true;

  public open() {
      this.isOpen = true;
      this.opQueue.forEach(({ operation, forward, observer }) => {
          forward(operation).subscribe(observer);
      });
      this.opQueue = new Set();
  }

  public close() {
      this.isOpen = false;
      // TODO: clean up the queue
  }

  public request(operation: Operation, forward: NextLink) {
      if (this.isOpen) {
          return forward(operation);
      }
      if (operation.getContext()['skipQueue']) {
          return forward(operation);
      }
      return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
          const operationEntry = { operation, forward, observer };
          this.enqueue(operationEntry);
          return () => this.cancelOperation(operationEntry);
      });
  }

  private cancelOperation(entry: OperationQueueEntry) {
      this.opQueue = this.opQueue.filter(e => e !== entry);
  }

  private enqueue(entry: OperationQueueEntry) {
      this.opQueue.add(entry);
  }
}