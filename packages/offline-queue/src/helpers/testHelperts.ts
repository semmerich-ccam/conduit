import { ApolloLink, FetchResult, GraphQLRequest, Observable, gql } from "@apollo/client/core";
import OfflineQueueLink from "../lib/offlineLink";
import { TestLink } from "../lib/testLink";
import { ExecutionResult } from "graphql";

export interface ObservableValue {
  value?: ExecutionResult | Error;
  delay?: number;
  type: 'next' | 'error' | 'complete';
}

export interface Unsubscribable {
  unsubscribe: () => void;
}

export const assertObservableSequence = (
  observable: Observable<ExecutionResult>,
  sequence: ObservableValue[],
  initializer: (sub: Unsubscribable) => void = () => undefined,
): Promise<boolean | Error> => {
  let index = 0;
  if (sequence.length === 0) {
    throw new Error('Observable sequence must have at least one element');
  }
  return new Promise((resolve, reject) => {
    const sub = observable.subscribe({
      next: (value: FetchResult) => {
        expect({ type: 'next', value }).toEqual(sequence[index]);
        index++;
        if (index === sequence.length) {
          resolve(true);
        }
      },
      error: (value: FetchResult) => {
        expect({ type: 'error', value }).toEqual(sequence[index]);
        index++;
        // This check makes sure that there is no next element in
        // the sequence. If there is, it will print a somewhat useful error
        expect(undefined).toEqual(sequence[index]);
        resolve(true);
      },
      complete: () => {
        expect({ type: 'complete' }).toEqual(sequence[index]);
        index++;
        // This check makes sure that there is no next element in
        // the sequence. If there is, it will print a somewhat useful error
        expect(undefined).toEqual(sequence[index]);
        resolve(true);
      },
    });
    initializer(sub);
  });
};

// Not sure if I like this here
export const setupTests = () => {
 

  const testResponse = {
    data: {
      test: 'update',
    },
  };

  const op: GraphQLRequest = {
    query: gql`
      {
        test
      }
    `,
    context: {
      testResponse,
    },
  };
  return { op, testResponse };
};
