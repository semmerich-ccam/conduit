import { CC_PERMISSIONS } from "../lib/constants";
import permissions from "../lib/permissions";
import { ICC_PERMISSION_RESPONSE } from "../types/permissions.types";

const getCameraPermissionAsync = async (): Promise<ICC_PERMISSION_RESPONSE>{
  return permissions.check(CC_PERMISSIONS.CAMERA);
}