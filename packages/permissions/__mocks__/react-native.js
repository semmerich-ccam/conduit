//export * from "react-native";
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn().mockImplementation(function (obj) {
      const os = this.OS;
    const value = obj[`${os}`]
    return !value ? obj.default : value
    })
  }
}))
