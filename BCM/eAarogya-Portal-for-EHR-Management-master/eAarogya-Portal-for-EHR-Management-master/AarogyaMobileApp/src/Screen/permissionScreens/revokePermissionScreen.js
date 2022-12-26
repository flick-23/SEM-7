import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { TextInput, IconButton, Button } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import webServer from "../../api/webServer";
import AppContext from "../../Context/appContext";
import {
  useFonts,
  Ubuntu_700Bold,
  Ubuntu_400Regular,
} from "@expo-google-fonts/ubuntu";
import RevokePerm from "../../../assets/revoke.png";
import Loader from "../Loader";

const { width: WIDTH } = Dimensions.get("window");
const revokePermissionScreen = (props) => {
  const { data, signin } = React.useContext(AppContext);
  var info = props.navigation.getParam("info", "");
  console.log(info);
  const [fontsLoaded] = useFonts({ Ubuntu_700Bold, Ubuntu_400Regular });
  const [docId, setdocId] = React.useState(info);
  const [loader, setloader] = React.useState("false");

  const revokePermission = async () => {
    try {
      setloader("true");
      console.log(docId);
      const response = await webServer.post("/revoke-permission", {
        doctorID: docId,
        username: data.username,
      });
      console.log(response.status);
      setloader("false");
      if (response.status == 200) {
        alert(`The permission has been revoked from Doctor having ${docId} Id`);
        setdocId("");
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (!fontsLoaded || loader == "true") return <Loader></Loader>;
  else
    return (
      <View style={styles.backgroundContainer}>
        <View style={styles.headContainer}>
          <IconButton
            icon="cancel"
            size={35}
            color="#fff"
            style={{ marginLeft: 10 }}
          />
          <Text style={styles.headText}>Revoke Permission</Text>
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome
            style={styles.Inputicon}
            name="vcard"
            size={25}
            color="#0f4c75"
          />
          <TextInput
            style={styles.Input}
            placeholder={"Enter Doctor's ID"}
            underlineColorAndroid="transparent"
            onChangeText={(newValue) => setdocId(newValue)}
            value={docId}
          />
        </View>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => revokePermission()}
        >
          Submit
        </Button>
        <Button
          mode="contained"
          icon="qrcode"
          style={styles.button}
          onPress={() => {
            props.navigation.replace("Scaner");
          }}
        >
          Scan
        </Button>
        <Image
          source={RevokePerm}
          style={{ height: 250, width: 250, marginTop: 40 }}
        />
      </View>
    );
};
export default revokePermissionScreen;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    alignItems: "center",
    width: null,
    height: null,
    backgroundColor: "#fff",
  },
  headContainer: {
    flexDirection: "row",
    width: "100%",
    height: 150,
    backgroundColor: "#0f4c75",
    borderBottomLeftRadius: 60,
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  headText: {
    margin: 10,
    color: "#fff",
    fontSize: 30,
    fontFamily: "Ubuntu_700Bold",
  },
  Input: {
    marginBottom: 10,
    width: WIDTH - 55,
    height: 45,
    borderRadius: 25,
    fontSize: 16,
    paddingLeft: 45,
    backgroundColor: "transparent",
    marginHorizontal: 25,
  },
  InputContainer: {
    marginTop: 50,
  },
  Inputicon: {
    position: "absolute",
    top: 8,
    left: 37,
  },
  Inputicon1: {
    position: "absolute",
    top: 65,
    left: 37,
  },
  button: {
    width: WIDTH - 150,
    marginTop: 20,
    justifyContent: "center",
    height: 45,
    fontSize: 30,
  },
});
