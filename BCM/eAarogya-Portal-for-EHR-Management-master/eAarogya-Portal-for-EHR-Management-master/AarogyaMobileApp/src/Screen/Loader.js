import React from "react";
import { ActivityIndicator, StyleSheet, Text, View, Modal } from "react-native";
import { DoubleCircleLoader } from "react-native-indicator";
//import LottieView from 'lottie-react-native';
export default function Loader() {
  return (
    <Modal style={styles.container} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <DoubleCircleLoader size={150} color="#0f4c75" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
