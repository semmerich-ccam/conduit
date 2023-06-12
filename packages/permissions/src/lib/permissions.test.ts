

import Permissions from './permissions'

describe('The Permissions Class', () => {
  beforeAll(() => {
   
  })
  beforeEach(() => {
    //RNPermissions.mockClear();
    
    
  })
  it('should return check if the camera permission is accepted', async () => {
    // Inputs

    const inputs = 'camera';
    const result = await Permissions.check(inputs);

    // Outputs
    const outputs = {"status": "granted"}

    expect(result).toStrictEqual(outputs);
  })
});