import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Ubuntu_700Bold,
  Ubuntu_400Regular,
} from "@expo-google-fonts/ubuntu";
import AvatarImg from "../../assets/avatar.png";
import AppContext from "../Context/appContext";
import Loader from "../Screen/Loader";

const { width: WIDTH } = Dimensions.get("window");

const accountScreen = (props) => {
  const { data, signin } = React.useContext(AppContext);
  const [fontsLoaded] = useFonts({ Ubuntu_700Bold, Ubuntu_400Regular });

  if (!fontsLoaded) return <Loader />;
  else
    return (
      <View style={styles.backgroundContainer}>
        <View
          style={{
            position: "absolute",
            top: -310,
            width: WIDTH,
            height: 400,
            backgroundColor: "#0f4c75",
            borderRadius: 200,
          }}
        ></View>
        <Avatar.Image source={AvatarImg} size={150} />
        <Text style={{ ...styles.text, fontSize: 30 }}>{data.name}</Text>
        {/* <Text style={{ ...styles.text, marginTop: 50 }}>
          Medical ID: {data._id}
        </Text> */}
        <Text style={styles.text}>Username: {data.username}</Text>
        <Text style={styles.text}>Email: {data.email}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate("signin");
          }}
        >
          <Text style={styles.btntext}>Logout</Text>
        </TouchableOpacity>
        <View
          style={{
            position: "absolute",
            backgroundColor: "#0f4c75",
            bottom: 0,
            left: -100,
            width: 200,
            height: 200,
            borderRadius: 200,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            backgroundColor: "#0f4c75",
            bottom: 0,
            right: -100,
            width: 200,
            height: 200,
            borderRadius: 200,
          }}
        ></View>
        <View
          style={{
            position: "absolute",
            backgroundColor: "#ddd",
            bottom: 0,
            left: 100,
            width: WIDTH - 200,
            height: 200,
            borderRadius: WIDTH - 200,
          }}
        ></View>
      </View>
    );
};
export default accountScreen;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    alignItems: "center",
    width: null,
    height: null,
    marginTop: 100,
  },
  button: {
    width: WIDTH - 110,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#0f4c75",
    marginTop: 40,
    justifyContent: "center",
  },
  btntext: {
    textAlign: "center",
    fontSize: 25,
    color: "#fff",
    fontFamily: "Ubuntu_700Bold",
  },
  text: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 20,
    color: "#0f4c75",
  },
});
