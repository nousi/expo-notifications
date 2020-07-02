import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import * as Permissions from "expo-permissions";

export default class App extends React.Component {
  state = {
    isNotificationPermitted: false,
    isLocationPermitted: false,
  };

  async _confirmNotificationPermission() {
    const permission = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (permission.status === "granted") return true;
    const askResult = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    return askResult.status === "granted";
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello, React Native!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
