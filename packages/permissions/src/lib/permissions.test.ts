jest.enableAutomock();

import { CC_PERMISSIONS } from './constants';
import Permissions from './permissions'

describe('The Permissions Class', async () => {
  beforeAll(() => {
   
  })
  beforeEach(() => {
    //RNPermissions.mockClear();
  
    
  })
  it('should return check if the camera permission is accepted', async () => {
    // Inputs
    const inputs = CC_PERMISSIONS.CAMERA;
    const result = await Permissions.check(inputs);

    // Outputs
    const outputs = ''

    expect(result).toBe(outputs);
  })
});