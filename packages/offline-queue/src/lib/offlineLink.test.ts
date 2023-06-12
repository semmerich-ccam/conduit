// Based off the offline queue community link
import OfflineQueueLink from './offlinelink';
import {  TestLink } from './testLink';
import { assertObservableSequence, setupTests } from '../helpers/testHelperts'
import {
  execute,
  GraphQLRequest,
  ApolloLink,
  Operation,
  split,
} from '@apollo/client/link/core';
import gql from 'graphql-tag';

describe('Manual offlineLink', () => {
    let link: ApolloLink;
    let offlineLink: OfflineQueueLink;
    let testLink: TestLink;

  const { op, testResponse } = setupTests();

  beforeEach(() => {
    jest.useFakeTimers();
    testLink = new TestLink();
    offlineLink = new OfflineQueueLink();
    link = ApolloLink.from([offlineLink, testLink]);
  });

  it('should forward the operation', () => {
    return new Promise<void>((resolve, reject): void => {
      execute(link, op).subscribe({
        next: () => undefined,
        error: (error) => reject(error),
        complete: () => {
          expect(testLink.operations).toHaveLength(1);
          expect(testLink.operations[0].query).toEqual(op.query);
          resolve();
        },
      });
      jest.runAllTimers();
    });
  });
  it('should skip the queue when asked to', () => {
    const opWithSkipQueue: GraphQLRequest = {
      query: gql`
        {
          test
        }
      `,
      context: {
        skipQueue: true,
      },
    };
    offlineLink.open();
    return new Promise<void>((resolve, reject) => {
      execute(link, opWithSkipQueue).subscribe({
        next: (data) => undefined,
        error: (error) => reject(error),
        complete: () => {
          expect(testLink.operations).toHaveLength(1);
          expect(testLink.operations[0].query).toEqual(op.query);
          resolve();
        },
      });
      jest.runAllTimers();
    });
  });
  it('should pass through errors', () => {
    const testError = new Error('Test Error');
    const opWithError: GraphQLRequest = {
      query: gql`
        {
          test
        }
      `,
      context: {
        testError,
      },
    };
    return new Promise((resolve, reject) => {
      resolve(
        assertObservableSequence(
          execute(link, opWithError),
          [{ type: 'error', value: testError }],
          () => jest.runAllTimers(),
        ),
      );
    });
  });
  it('should hold requests when you open it', () => {
    offlineLink.open();
    const sub = execute(link, op).subscribe(() => undefined);
    expect(testLink.operations).toHaveLength(0);
    sub.unsubscribe();
  });
  it('should release held requests when you close it', () => {
    offlineLink.open();
    return assertObservableSequence(
      execute(link, op),
      [{ type: 'next', value: testResponse }, { type: 'complete' }],
      () => {
        expect(testLink.operations).toHaveLength(0);
        offlineLink.close();
        jest.runAllTimers();
      },
    );
  });

  it('removes operations from the queue that are cancelled while open', () => {
    offlineLink.open();
    const observable = execute(link, op);
    const subscriber = observable.subscribe(() => {
      /* do nothing */
    });
    subscriber.unsubscribe();
    offlineLink.close();
    expect(testLink.operations).toHaveLength(0);
  });
});

describe('Auto offlineLink', () => {
    let link: ApolloLink;
    let offlineLink: OfflineQueueLink;
    let testLink: TestLink;


  const { op, testResponse } = setupTests();
  let isOffline = false;
  beforeEach(() => {
    jest.useFakeTimers();
    testLink = new TestLink();
    offlineLink = new OfflineQueueLink();
    link = ApolloLink.from([
      split((): boolean => {
        console.log('is: ', isOffline)
        if (isOffline) {
          offlineLink.open();
        } else {
          offlineLink.close();
        }
        return isOffline;
      }, offlineLink),
      testLink,
    ]);
  });
  it('should forward the operation when online', () => {
    isOffline = false;
    return new Promise<void>((resolve, reject): void => {
      execute(link, op).subscribe({
        next: () => undefined,
        error: (error) => reject(error),
        complete: () => {
          expect(testLink.operations).toHaveLength(1);
          expect(testLink.operations[0].query).toEqual(op.query);
          resolve();
        },
      });
      jest.runAllTimers();
    });
  });
  it('should queue the operation when offline', () => {
    isOffline = true;
    const sub = execute(link, op).subscribe(() => undefined);
    expect(offlineLink.operations).toHaveLength(1);
    expect(testLink.operations).toHaveLength(0);
    sub.unsubscribe();
  });
  it('should switch when network status changes', () => {
    isOffline = true;
    setTimeout(() => {
      isOffline = !isOffline;
    }, 10);
  });
});
