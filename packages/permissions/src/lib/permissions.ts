import {check, checkMultiple, checkNotifications, openSettings, request, requestNotifications,} from 'react-native-permissions';
import { CC_PERMISSIONS } from './constants';
import { CC_PERMISSIONS_MAP } from './permissionsMapper';
import { ICC_PERMISSION_RESPONSE } from '../types/permissions.types';
import invariant from 'tiny-invariant';
class Permissions {
  canOpenSettings = () => Promise.resolve(true);

  openSettings = () => {
    return openSettings();
  };

  /** @Deprecated */
  openNotificationSettings = () => {
    return invariant(false, 'openNotificationSettings has been deprectated');
  };
 
  check = async (permission: CC_PERMISSIONS): Promise<ICC_PERMISSION_RESPONSE> => {
    // Notifications are a special Case
    if (permission === CC_PERMISSIONS.NOTIFICATIONS) {
      const status = await checkNotifications();
      return { status }
    } else {
      const _permission = CC_PERMISSIONS_MAP[permission];
      const status = await check(_permission);
      return { status };
    }
  };

  request = (permission: CC_PERMISSIONS) => {
    // Notifications are a special Case
    if (permission === CC_PERMISSIONS.NOTIFICATIONS) {
      return requestNotifications([]);
    } else {
      const _permission = CC_PERMISSIONS_MAP[permission];
      return request(_permission, options);
    }
  };

  checkMultiple = (permissions: CC_PERMISSIONS) => {
    return checkMultiple(permissions);
  };

  // TODO: determine if we need this.
  /*checkLocationPermissionType = () => {
    return Promise.all([
      RNPermissions.check(PLATFORM_PERMISSIONS.LOCATION_ALWAYS, {
        type: LOCATION_PERMISSION_TYPE_ALWAYS,
      }),
      RNPermissions.check(PLATFORM_PERMISSIONS.LOCATION_WHEN_IN_USE),
    ])
      .then((response) => {
        if (
          response[0] === RESPONSE_AUTHORIZED &&
          response[1] === RESPONSE_AUTHORIZED
        ) {
          return LOCATION_PERMISSION_TYPE_ALWAYS;
        } else if (response[1] === RESPONSE_AUTHORIZED) {
          return LOCATION_PERMISSION_TYPE_WHEN_IN_USE;
        } else {*/
          /**
           * Returns either 'undeteremined' or 'denied' if no location permission
           * has yet been granted
           *  */
        /*  return response[1];
        }
      })
      .catch((error) => {
        console.error(
          `Error getting location permission type: ${error.message}`,
        );
      });
  };*/
}
const askAsync = async (...permissions: PermissionType[]): Promise<PermissionsResponse> => {

}
export default new Permissions();
