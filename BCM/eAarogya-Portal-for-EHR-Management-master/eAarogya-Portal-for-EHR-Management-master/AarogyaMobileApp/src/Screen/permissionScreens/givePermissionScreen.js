import React, { useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import { TextInput, IconButton, Button } from "react-native-paper";
import webServer from "../../api/webServer";
import AppContext from "../../Context/appContext";
import { FontAwesome } from "@expo/vector-icons";
import {
  useFonts,
  Ubuntu_700Bold,
  Ubuntu_400Regular,
} from "@expo-google-fonts/ubuntu";
import GrantPerm from "../../../assets/grant.png";
import Loader from "../Loader";

const { width: WIDTH } = Dimensions.get("window");

const givePermissionScreen = (props) => {
  const { data, signin } = React.useContext(AppContext);
  var info = props.navigation.getParam("info", "");
  console.log(info);
  const [fontsLoaded] = useFonts({ Ubuntu_700Bold, Ubuntu_400Regular });
  const [docId, setdocId] = React.useState(info);
  const [loader, setloader] = React.useState("false");

  const givePermission = async () => {
    try {
      setloader("true");
      console.log(docId);
      const response = await webServer.post("/give-permission", {
        doctorID: docId,
        username: data.username,
      });
      console.log(response.data.message, response.status);
      setloader("false");
      if (response.status == 200) {
        alert(`The permission has been granted to Doctor having ${docId} Id`);
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
            icon="ticket-account"
            size={35}
            color="#fff"
            style={{ marginLeft: 10 }}
          />
          <Text style={styles.headText}>Give Permission</Text>
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome
            style={styles.InputIcon}
            name="vcard"
            size={25}
            color="#0f4c75"
          />
          <TextInput
            style={styles.Input}
            placeholder={"Enter Doctor's ID"}
            value={docId}
            onChangeText={(newValue) => setdocId(newValue)}
          />
        </View>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => givePermission()}
        >
          Submit
        </Button>
        <Button
          mode="contained"
          contentStyle={{ fontFamily: "Ubuntu_700Bold" }}
          icon="qrcode"
          style={styles.button}
          onPress={() => {
            props.navigation.replace("QRCodeScanner");
          }}
        >
          Scan
        </Button>
        <Image
          source={GrantPerm}
          style={{ height: 250, width: 250, marginTop: 40 }}
        />
      </View>
    );
};
export default givePermissionScreen;

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
    color: "#0f4c75",
    marginHorizontal: 25,
  },
  InputContainer: {
    marginTop: 70,
  },
  InputIcon: {
    position: "absolute",
    top: 8,
    left: 37,
  },
  button: {
    width: WIDTH - 150,
    marginTop: 20,
    justifyContent: "center",
    height: 45,
    fontSize: 30,
  },
  btntext: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
  },
});
