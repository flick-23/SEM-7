import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { TextInput } from "react-native-paper";
import AppContext from "../../Context/appContext";
import Logo from "../../../assets/logo.png";
import { FontAwesome } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useFonts,
  Ubuntu_700Bold,
  Ubuntu_400Regular,
} from "@expo-google-fonts/ubuntu";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "../Loader";

const { width: WIDTH } = Dimensions.get("window");
const HEIGHT = Dimensions.get("window").height;
const signupdetailScreen = (props) => {
  const { data, signin } = React.useContext(AppContext);
  const [fontsLoaded] = useFonts({ Ubuntu_700Bold, Ubuntu_400Regular });
  const [username, setusername] = React.useState("");
  const [password, setpassword] = React.useState("");

  if (!fontsLoaded) {
    return <Loader />;
  } else
    return (
      <View style={styles.backgroundContainer}>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            marginLeft: 25,
            marginTop: 40,
          }}
        >
          <Image source={Logo} style={{ height: 50, width: 50 }} />
          <Text
            style={{
              color: "#0f4c75",
              fontWeight: "bold",
              fontSize: 30,
              marginLeft: 10,
            }}
          >
            eAarogya
          </Text>
        </View>

        <Text
          style={{
            fontSize: 25,
            color: "#0f4c75",
            fontFamily: "Ubuntu_700Bold",
            marginBottom: 10,
            textAlign: "center",
            marginHorizontal: 5,
          }}
        >
          e-Card Details
        </Text>
        <View style={styles.InputContainer}>
          <FontAwesome
            style={styles.Inputicon}
            name="vcard"
            size={28}
            color="grey"
          />
          <TextInput
            style={styles.Input}
            placeholder={" Aadhaar number"}
            placeholderTextColor={"#0f4c75"}
          />
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome
            style={styles.Inputicon}
            name="user"
            size={28}
            color="grey"
          />
          <TextInput
            style={styles.Input}
            placeholder={"Name"}
            placeholderTextColor={"#0f4c75"}
          />
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome
            style={styles.Inputicon}
            name="home"
            size={28}
            color="grey"
          />
          <TextInput
            style={styles.Input}
            placeholder={"Adress"}
            placeholderTextColor={"#0f4c75"}
          />
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome
            style={styles.Inputicon}
            name="calendar"
            size={28}
            color="grey"
          />
          <TextInput
            style={styles.Input}
            placeholder={"Dob"}
            placeholderTextColor={"#0f4c75"}
          />
        </View>
        <View style={styles.InputContainer}>
          <Foundation
            style={styles.Inputicon}
            name="male-female"
            size={28}
            color="grey"
          />
          <TextInput
            style={styles.Input}
            placeholder={"Gender"}
            placeholderTextColor={"#0f4c75"}
          />
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome
            style={styles.Inputicon}
            name="mobile"
            size={28}
            color="grey"
          />
          <TextInput
            style={styles.Input}
            placeholder={"Phone"}
            placeholderTextColor={"#0f4c75"}
          />
        </View>
        <View style={styles.InputContainer}>
          <MaterialCommunityIcons
            style={styles.Inputicon}
            name="email"
            size={28}
            color="grey"
          />
          <TextInput
            style={styles.Input}
            placeholder={"E-mail"}
            placeholderTextColor={"#0f4c75"}
          />
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome
            style={styles.Inputicon}
            name="user"
            size={28}
            color="grey"
          />
          <TextInput
            style={styles.Input}
            placeholder={"Username"}
            placeholderTextColor={"#0f4c75"}
            onChangeText={(newValue) => setusername(newValue)}
          />
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome
            style={styles.Inputicon}
            name="lock"
            size={28}
            color="grey"
          />
          <TextInput
            style={styles.Input}
            secureTextEntry={true}
            placeholder={"Password"}
            placeholderTextColor={"#0f4c75"}
            onChangeText={(newValue) => setpassword(newValue)}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate("mainFlow");
          }}
        >
          <Text style={styles.btntext}>Sign-up</Text>
        </TouchableOpacity>
      </View>
    );
};

signupdetailScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: StatusBar.currentHeight,
  },
  logo: {
    width: 300,
    height: 300,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "500",
    opacity: 0.5,
    marginTop: 0,
  },
  Input: {
    width: WIDTH - 55,
    height: 45,
    fontSize: 16,
    fontFamily: "Ubuntu_400Regular",
    paddingLeft: 45,
    marginHorizontal: 25,
    zIndex: -1,
    backgroundColor: "transparent",
  },
  InputContainer: {
    marginTop: 10,
  },
  Inputicon: {
    position: "absolute",
    top: 8,
    left: 37,
    color: "#0f4c75",
    zIndex: 2,
  },
  button: {
    width: WIDTH - 110,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#0f4c75",
    marginTop: 20,
    justifyContent: "center",
    elevation: 5,
  },
  btntext: {
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
    fontFamily: "Ubuntu_700Bold",
  },
});

export default signupdetailScreen;
