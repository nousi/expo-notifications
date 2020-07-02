import React from "react";
import { StyleSheet, Text, View, Platform, Button } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

export default class App extends React.Component {
  state = {
    isNotificationPermitted: false,
    isLocationPermitted: false,
  };

  async componentDidMount() {
    this.setState({
      isNotificationPermitted: await this._confirmNotificationPermission(),
      isLocationPermitted: await this._confirmLocationPermission(),
    });
    Notifications.addListener(this._onReceiveNotification);
  }

  async _confirmNotificationPermission() {
    const permission = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (permission.status === "granted") {
      return true;
    } else {
      const askResult = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (askResult.status === "granted") {
        return true;
      }
    }
  }

  async _confirmLocationPermission() {
    const permissionIsValid = (permission: Permissions.PermissionResponse) => {
      if (permission.status !== "granted") return false;
      if (Platform.OS !== "ios") return true;
      return permission.permissions.location.ios.scope === "always";
    };
    const permission = await Permissions.getAsync(Permissions.LOCATION);
    if (permissionIsValid(permission)) return true;
    const askResult = await Permissions.askAsync(Permissions.LOCATION);
    return permissionIsValid(askResult);
  }

  async _sendLocalNotification() {
    await Notifications.presentLocalNotificationAsync({
      title: "テストローカル通知",
      body: "これはテスト用のローカル通知です",
      data: {
        message: "テストローカル通知を受け取りました",
      },
      ios: {
        _displayInForeground: true,
      },
    });
  }

  _onReceiveNotification(notification: Notification) {
    alert(notification.data.message);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          通知の権限:
          {this.state.isNotificationPermitted ? "○" : "×"}
        </Text>
        <Text>
          位置情報の権限: {this.state.isLocationPermitted ? "○" : "×"}
        </Text>
        <Button
          title="ローカル通知を送信する"
          onPress={this._sendLocalNotification}
        />
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
