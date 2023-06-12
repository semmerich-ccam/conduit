
// @ts-nocheck
/**
 * Purpose
 * 
 * in the application there are places where users call check('ios.permissio.Camera'); and other places where check('camera') are called. We need to handle both cases. implicitly
 * 
 * proxu => check if prop is in ios or android depending on platform. if yes retrn prop, else check for collection like camera, if no collection, throw error
 * 
 * but we cant return an array 
 */


import { Platform } from "react-native";
import { CC_PERMISSIONS, PERMISSIONS_IOS, PLATFORM_PERMISSIONS } from "./constants";
import { PERMISSIONS } from "react-native-permissions";

export const CC_PERMISSIONS_MAP = new Proxy(CC_PERMISSIONS, {
  get(target, prop, receiver)//: string| string[] | undefined
  {
   


// Otherwise do the manual mapping.
  // @ts-ignore
  if (prop === 'CAMERA') {
      const retValue = Platform.select({
        ios: { CAMERA: PERMISSIONS_IOS.CAMERA, MICROPHONE: PERMISSIONS_IOS.MICROPHONE},
        android: PERMISSIONS.ANDROID.CAMERA,
      });
      console.log('retValue', retValue);
      return retValue;
    }
     if (prop ==='LOCATION') {
      const retValue =  Platform.select({
        ios: {
          LOCATION_ALWAYS: PERMISSIONS_IOS.LOCATION_ALWAYS,
          LOCATION_WHEN_IN_USE: PERMISSIONS_IOS.LOCATION_WHEN_IN_USE,
        },
        android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      });
      console.log('retValue', retValue);
      return retValue;
    }
    if (prop === 'NOTIFICATIONS') {
      return Platform.select({
        ios: PERMISSIONS_IOS,
        android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
      });
    }
     if(prop in PLATFORM_PERMISSIONS) {
      return Reflect.get(PLATFORM_PERMISSIONS, prop);
    }
  },
  has(target, p) {
     
      return p.toString().toLowerCase() in target || p.toString().toUpperCase() in target;
  },
  defineProperty(target, p) {
      console.log('get prop desc called', p);
    return true
  },

});

