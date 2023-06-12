import { Platform } from 'react-native';
import { PERMISSIONS, RESULTS } from 'react-native-permissions';
import { ICC_PERMISSION_STATUS } from '../types/permissions.types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars


export const PERMISSIONS_IOS = PERMISSIONS.IOS

export const CC_PERMISSION_STATUS: ICC_PERMISSION_STATUS = {
  AUTHORIZED: RESULTS.GRANTED,
  DENIED: RESULTS.DENIED,
  UNDETERMINED: RESULTS.DENIED,
};
/* export enum CC_PERMISSIONS {
  CAMERA = 'camera',
  NOTIFICATIONS = 'notification',
  LOCATION = 'location',

}; */

export const CC_PERMISSIONS = {
  CAMERA : 'camera',
  NOTIFICATIONS :'notification',
  LOCATION : 'location',
}

export const PLATFORM_PERMISSIONS = Platform.select({
  android: PERMISSIONS.ANDROID,
  ios: PERMISSIONS_IOS,
  windows: PERMISSIONS.WINDOWS,
  default: {},
});