import '@testing-library/jest-native/extend-expect';
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
/* jest.mock('react-native-permissions', () =>
  require('react-native-permissions/mock'),
); */
import mock from 'react-native-permissions/mock';
jest.mock('react-native-permissions', () => mock);
