

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
  it('should return check if the location permission is accepted', async () => {
    // Inputs

    const inputs = 'location';
    const result = await Permissions.check(inputs);

    // Outputs
    const outputs = {"status": "granted"}

    expect(result).toStrictEqual(outputs);
  })
  it('should return check if the notifications permission is accepted', async () => {
    // Inputs

    const inputs = 'notifications';
    const result = await Permissions.check(inputs);

    // Outputs
    const outputs = {"status": "granted"}

    expect(result).toStrictEqual(outputs);
  })

  it('should return check if the camera and lcoation permissions are accepted', async () => {
    // Inputs

    const inputs = ['camera', 'location'];
    const result = await Permissions.checkMultiple(inputs);

    // Outputs
    const outputs = {"status": "granted"}

    expect(result).toStrictEqual(outputs);
  })
});