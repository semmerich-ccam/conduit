// @ts-nocheck
import {check, checkMultiple, checkNotifications, openSettings, request, requestNotifications,} from 'react-native-permissions';
//import { CC_PERMISSIONS } from './constants';
//import { CC_PERMISSIONS_MAP } from './permissionsMapper';
//import { ICC_PERMISSION_RESPONSE } from '../types/permissions.types';

import { CC_PERMISSIONS } from "./constants";
import { CC_PERMISSIONS_MAP } from "./permissionsMapper";

//import invariant from 'tiny-invariant';
class Permissions {
   canOpenSettings = () => Promise.resolve(true);

  openSettings = () => {
    return openSettings();
  };

  /** @Deprecated */
  /* openNotificationSettings = () => {
    return invariant(false, 'openNotificationSettings has been deprectated');
  }; */
 
  check = async (permission: string) => {
    let status = null
    // Notifications are a special Case
    if (permission === CC_PERMISSIONS.NOTIFICATIONS) {
       status = await checkNotifications();
      return { status }
    } else {
      const _permission = CC_PERMISSIONS_MAP.get(permission);
      console.log('permis', _permission)
      //TODO check if the return is multiple and call correct check
      if(_permission?.length && _permission.length > 1) {
        status = await checkMultiple(_permission)
      } else {
       status = await check(_permission);
      }
      return { status };
    } 
  };

   request = (permission: string) => {
    // Notifications are a special Case
    if (permission === CC_PERMISSIONS.NOTIFICATIONS) {
      return requestNotifications([]);
    } else {
      const _permission = CC_PERMISSIONS_MAP[permission];
      return request(_permission, options);
    
    }
  };

  checkMultiple = async (permissions: string[]) => {
    const permissionsToCheck = permissions.map( prm => CC_PERMISSIONS_MAP[prm])
    console.log(permissionsToCheck)
    const status = await checkMultiple(permissionsToCheck);
    return {status}
  }; 

  // TODO: determine if we need this.
  checkLocationPermissionType = () => {
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
        } else {
          /**
           * Returns either 'undeteremined' or 'denied' if no location permission
           * has yet been granted
           *  */
         return response[1];
        }
      })
      .catch((error) => {
        console.error(
          `Error getting location permission type: ${error.message}`,
        );
      });
  };}
/* const askAsync = async (...permissions: PermissionType[]): Promise<PermissionsResponse> => {

} */
export default new Permissions();
