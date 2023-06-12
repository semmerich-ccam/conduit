//jest.enableAutomock();
/* jest.mock('react-native-permissions');
jest.mock('react-native', () => {
  return { Platform: {
    ios: true,
    android: false,
  }}
}) */
import {CC_PERMISSIONS_MAP} from './permissionsMapper';



describe('The Permissions Mapper', () => {
  beforeAll(() => {
   
  })
  beforeEach(() => {
    //RNPermissions.mockClear();
  
    
  })
  it('should return the proper permissions strings for camera', ()=> {
    // Inputs
    
    const inputs = CC_PERMISSIONS_MAP.get('CAMERA');

    // Outputs
    const outputs = ["ios.permission.CAMERA", "ios.permission.MICROPHONE"]

    expect(inputs).toStrictEqual(outputs);
  })
  it('should return the proper permissions strings for location', ()=> {
    // Inputs
    
    const inputs = CC_PERMISSIONS_MAP.get('LOCATION');

    // Outputs
    const outputs = ["ios.permission.LOCATION_ALWAYS", "ios.permission.LOCATION_WHEN_IN_USE"]

    expect(inputs).toStrictEqual(outputs);
  })
  
})