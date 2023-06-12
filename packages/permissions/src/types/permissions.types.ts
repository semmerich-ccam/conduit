// Remap the react native permissions to impove upgrading
import { PERMISSIONS, RESULTS } from 'react-native-permissions';


export type ICC_PERMISSIONS = PERMISSIONS;

export interface ICC_PERMISSION_STATUS {
  AUTHORIZED: RESULTS | string;
  GRANTED:  RESULTS | string;
  DENIED:  RESULTS | string;
  UNDETERMINED:  RESULTS | string,
};
export interface ICC_PERMISSION_RESPONSE {
  // Determines the actual status
  status: ICC_PERMISSION_STATUS;
  // Short cut for if the status is granted
  granted: boolean;
  // Short cut for if the request can be made again
  canAskAgain: boolean;
}



