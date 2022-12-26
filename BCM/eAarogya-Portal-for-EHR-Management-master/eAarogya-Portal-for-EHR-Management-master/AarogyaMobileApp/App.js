import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import signupScreen from "./src/Screen/Signup-inScreens/signupScreen";
import signinScreen from "./src/Screen/Signup-inScreens/signinScreen";
import signupdetailScreen from "./src/Screen/Signup-inScreens/signupdetailScreen";
import otpverificationScreen from "./src/Screen/Signup-inScreens/otpverificationScreen";
import reportScreen from "./src/Screen/reportScreen";
import permissionScreen from "./src/Screen/permissionScreens/permissionScreen";
import revokePermissionScreen from "./src/Screen/permissionScreens/revokePermissionScreen";
import givePermissionScreen from "./src/Screen/permissionScreens/givePermissionScreen";
import givePermissionScanner from "./src/Screen/permissionScreens/givePermissionScanner";
import revokePermissionScanner from "./src/Screen/permissionScreens/revokePermissionScanner";
import viewPermissionScreen from "./src/Screen/permissionScreens/viewPermissionScreen";
import accountScreen from "./src/Screen/accountScreen";
import { AppProvider } from "./src/Context/appContext";
import { FontAwesome } from "@expo/vector-icons";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 25,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0f4c75',
    accent: '#3282b8',
  },
};
const PermissionStack = createStackNavigator({
  permission: permissionScreen,
  revokePermission: revokePermissionScreen,
  givePermission: givePermissionScreen,
  QRCodeScanner: givePermissionScanner,
  Scaner: revokePermissionScanner,
  viewPermission: viewPermissionScreen,
}, {
  headerMode: 'none',
})

const SwitchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    signin: signinScreen,
    signup: signupScreen,
    signupDetail: signupdetailScreen,
    OtpVerification: otpverificationScreen,
  }),
  mainFlow: createBottomTabNavigator({
 
    permission: {
      screen: PermissionStack,
      navigationOptions: {
        tabBarLabel: "Permissions",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="shield" size={24} color={tintColor} />
        ),
      }
    },

    report: {
      screen: reportScreen,
      navigationOptions: {
        tabBarLabel: "Reports",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="file-text" size={24} color={tintColor} />
        ),
      },
    },
    account: {
      screen: accountScreen,
      navigationOptions: {
        tabBarLabel: "Account",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="user" size={24} color={tintColor} />
        ),
      },
    },
  }, {
    tabBarOptions: {
      activeTintColor: '#0f4c75',
      inactiveTintColor: '#ccc',
      showIcon: true,
      labelStyle: {
        fontSize: 12,
      },
      style: {
        elevation: 15,
        borderTopColor: 'transparent'
      },
    }
  }),
});

const AppContainer = createAppContainer(SwitchNavigator);

export default () => {
  return (
    <PaperProvider theme={theme}>
      <AppProvider>
        <AppContainer />
      </AppProvider>
    </PaperProvider>
  );
};
