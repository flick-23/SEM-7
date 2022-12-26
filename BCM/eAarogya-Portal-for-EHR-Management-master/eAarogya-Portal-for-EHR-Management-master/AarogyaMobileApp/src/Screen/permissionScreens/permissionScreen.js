import React from "react";
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ImagePropTypes,
} from "react-native";
import Security from "../../../assets/security.png";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts, Ubuntu_700Bold } from "@expo-google-fonts/ubuntu";
import Loader from "../Loader";

const { width: WIDTH } = Dimensions.get("window");

const permissionScreen = (props) => {
  const [fontsLoaded] = useFonts({ Ubuntu_700Bold });
  if (!fontsLoaded)
    return (
      <View>
        <Loader></Loader>
      </View>
    );
  else
    return (
      <View style={styles.backgroundContainer}>
        <Image source={Security} style={{ width: 300, height: 300 }} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate("viewPermission")}
        >
          <Text style={styles.btntext}>View Permissions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate("givePermission")}
        >
          <Text style={styles.btntext}>Give Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate("revokePermission")}
        >
          <Text style={styles.btntext}>Revoke Permission</Text>
        </TouchableOpacity>
      </View>
    );
};
export default permissionScreen;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    width: WIDTH - 110,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#0f4c75",
    marginTop: 20,
    elevation: 5,
    justifyContent: "center",
  },
  btntext: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    fontFamily: "Ubuntu_700Bold",
  },
});
