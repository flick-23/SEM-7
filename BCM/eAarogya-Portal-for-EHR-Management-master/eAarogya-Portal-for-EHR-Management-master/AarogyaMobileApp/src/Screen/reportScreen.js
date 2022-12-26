import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { IconButton } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import webServer from "../api/webServer";
import AppContext from "../Context/appContext";
import { FlatList } from "react-native-gesture-handler";
import {
  useFonts,
  Ubuntu_700Bold,
  Ubuntu_400Regular,
} from "@expo-google-fonts/ubuntu";
import { LinearGradient } from "expo-linear-gradient";
import Report from "../../assets/reports.png";
import Loader from "../Screen/Loader";

const { width: WIDTH } = Dimensions.get("window");

const reportScreen = () => {
  const [fontsLoaded] = useFonts({ Ubuntu_700Bold, Ubuntu_400Regular });
  const { data, signin } = React.useContext(AppContext);
  const [reports, setReports] = React.useState([]);
  const [type, setType] = React.useState("");
  const [loader, setloader] = React.useState("false");

  const getReports = async () => {
    try {
      setloader("true");
      let response = await webServer.post("report-history", {
        medicalID: data._id,
      });
      setReports(response.data.data);
      setType("Reports");
      setloader("false");
    } catch (e) {
      console.log(e);
    }
  };

  const getPrescs = async () => {
    try {
      setloader("true");
      let response = await webServer.post("prescription-history", {
        medicalID: data._id,
      });
      setReports(response.data.data);
      setType("Prescriptions");
      setloader("false");
    } catch (e) {
      console.log(e);
    }
  };

  if (!fontsLoaded || loader == "true") {
    return <Loader></Loader>;
  } else {
    return (
      <View
        style={{
          ...styles.backgroundContainer,
          backgroundColor: reports.length ? "#eee" : "#fff",
        }}
      >
        <View
          style={{
            backgroundColor: "#0f4c75",
            marginTop: 100,
            padding: 50,
            alignItems: "center",
            width: "100%",
            borderBottomLeftRadius: 70,
          }}
        >
          <View style={{ marginTop: 100 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => getReports()}
            >
              <LinearGradient
                colors={["#3282b8", "#0f4c75"]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: "100%",
                  borderRadius: 20,
                }}
              />
              <Text style={styles.btntext}>Get Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => getPrescs()}>
              <LinearGradient
                colors={["#3282b8", "#0f4c75"]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: "100%",
                  borderRadius: 20,
                }}
              />
              <Text style={styles.btntext}>Get Prescriptions</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: "100%", height: "100%", marginTop: 20 }}>
          <Text
            style={{
              margin: 5,
              fontSize: 30,
              color: "#0f4c75",
              fontFamily: "Ubuntu_700Bold",
            }}
          >
            {type}
          </Text>
          {reports.length == 0 ? (
            <Image
              source={Report}
              style={{
                height: 350,
                width: 350,
                alignSelf: "center",
                marginTop: 20,
              }}
            />
          ) : (
            <FlatList
              contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
              }}
              data={reports}
              renderItem={({ item }) => (
                <View style={styles.box}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome
                      name="calendar-o"
                      size={15}
                      color="#ccc"
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.boxText}>{item.date}</Text>
                  </View>
                  <Text style={{ ...styles.boxText, fontSize: 20 }}>
                    {item.info}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </View>
    );
  }
};
export default reportScreen;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: StatusBar.currentHeight,
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "500",
    opacity: 0.5,
    marginTop: 10,
  },
  button: {
    width: WIDTH - 110,
    height: 45,
    borderRadius: 25,

    marginTop: 5,
    elevation: 1,
    justifyContent: "center",
  },
  btntext: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    fontFamily: "Ubuntu_700Bold",
  },
  box: {
    width: WIDTH - 30,
    margin: 5,
    padding: 13,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  boxText: {
    color: "#0f4c75",
    fontFamily: "Ubuntu_400Regular",
  },
});
