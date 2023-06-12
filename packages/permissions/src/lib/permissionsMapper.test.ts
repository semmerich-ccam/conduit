jest.enableAutomock();
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
    
    const inputs = CC_PERMISSIONS_MAP['CAMERA'];

    // Outputs
    const outputs = 'ios.permission.CAMERA'

    expect(inputs).toBe(outputs);
  })
  it('should return the proper permissions strings for location', ()=> {
    // Inputs
    
    const inputs = CC_PERMISSIONS_MAP['LOCATION'];

    // Outputs
    const outputs = 'ios.permission.LOCATION_ALWAYS'

    expect(inputs).toBe(outputs);
  })
  
})