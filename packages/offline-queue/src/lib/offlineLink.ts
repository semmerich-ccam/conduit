// Based off the offline queue community link
// Example of how this could work. Needs more work.
import {
  ApolloLink,
  Operation,
  FetchResult,
  NextLink,
} from '@apollo/client/link/core';
import {
  Observable,
  Observer,
  getMainDefinition,
} from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';

// For now we care only about mutations that edit
// How do we determine that its an edit
interface OperationQueueEntry {
  operation: Operation;
  forward: NextLink;
  observer: Observer<FetchResult>;
  subscription?: { unsubscribe: () => void };
}
enum FILTERS {
  UPDATE = 'mutation', // 'Update',
}
interface OperationQueueOptions {
  filterBy: [FILTERS | OperationTypeNode];
}
export default class OfflineQueueLink extends ApolloLink {
  private opQueue: Map<string, OperationQueueEntry> = new Map();

  private isOpen = false;
  public operations: Operation[];
  private options: OperationQueueOptions = {
    filterBy: [FILTERS.UPDATE],
  };

  constructor() {
    super();
    this.operations = [];
  }
  // open the queue for collection
  public open(options?: OperationQueueOptions) {
    this.isOpen = true;
    this.options = options || this.options;
  }

  // close the queue and send requests
  public close() {
    this.isOpen = false;
    this.opQueue.forEach((entry) => {
      try {
        const { operation, forward, observer } = entry;
        forward(operation).subscribe(observer);
      } catch (e) {
        console.error(' Queue failed to send', e);
        throw e;
      }
    });
    this.opQueue.clear();
  }

  public request(operation: Operation, forward: NextLink) {
    // If we have an update mutation enqueue it if we are offline.
    if (!this.isOpen) {
      return forward(operation);
    }
    if (operation.getContext()['skipQueue']) {
      return forward(operation);
    }
    const definition = getMainDefinition(operation.query);

    // Check that we have the proper request and that it matches one of the filters
    if (
      definition.kind === Kind.OPERATION_DEFINITION &&
      this.options.filterBy.some((filter) => definition.operation === filter)
    ) {
      return new Observable<FetchResult>((observer: Observer<FetchResult>) => {
        const operationEntry = { operation, forward, observer };
        this.enqueue(operationEntry);
        return () => this.cancelOperation(operationEntry);
      });
    } else {
      return forward(operation);
    }
  }

  private cancelOperation(entry: OperationQueueEntry) {
    const parsedEntry = JSON.stringify(entry.operation);
    if (this.opQueue.has(parsedEntry)) {
      this.opQueue.delete(parsedEntry);
    }
  }

  private enqueue(entry: OperationQueueEntry) {
    // Transform the entry into a string for easy comparison
    this.opQueue.set(JSON.stringify(entry.operation), entry);
  }
}
