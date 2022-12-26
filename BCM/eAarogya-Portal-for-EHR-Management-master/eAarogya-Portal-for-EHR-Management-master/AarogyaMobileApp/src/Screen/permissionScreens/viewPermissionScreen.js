import React from "react";
import { StyleSheet, Text, View, Dimensions, FlatList } from "react-native";
import { IconButton } from "react-native-paper";
import webServer from "../../api/webServer";
import AppContext from "../../Context/appContext";
import {
  useFonts,
  Ubuntu_700Bold,
  Ubuntu_400Regular,
} from "@expo-google-fonts/ubuntu";
import Loader from "../Loader";
const { width: WIDTH } = Dimensions.get("window");

const viewPermissionScreen = (props) => {
  const { data, signin } = React.useContext(AppContext);
  const [info, setinfo] = React.useState("false");
  const [fontsLoaded] = useFonts({ Ubuntu_700Bold, Ubuntu_400Regular });
  const load = "false";

  React.useEffect(() => {
    const viewPermission = async () => {
      try {
        const username = data.username;

        const response = await webServer.post("/view-permissions", {
          username: username,
        });
        setinfo(response.data.permissions);
      } catch (e) {
        console.log(e);
      }
    };
    viewPermission();
  }, []);

  if (!fontsLoaded || info == "false") return <Loader></Loader>;
  else
    return (
      <View style={styles.backgroundContainer}>
        <View style={styles.headContainer}>
          <IconButton
            icon="security"
            size={35}
            color="#fff"
            style={{ marginLeft: 10 }}
          />
          <Text style={styles.headText}>Permissions</Text>
        </View>
        <FlatList
          data={info}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.box}>
                <Text style={styles.boxText}>
                  <Text style={styles.subText}>Name:</Text> {item.name}
                </Text>
                <Text style={styles.boxText}>
                  <Text style={styles.subText}>Organisation:</Text> {item.org}
                </Text>
                <Text style={styles.boxText}>
                  <Text style={styles.subText}>Specialty:</Text> {item.type}
                </Text>
                <Text style={styles.boxText}>
                  <Text style={styles.subText}>Doctor ID:</Text> {item._id}
                </Text>
              </View>
            );
          }}
        />
      </View>
    );
};
export default viewPermissionScreen;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: null,
    height: null,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
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
    fontSize: 40,
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
    fontSize: 20,
    fontFamily: "Ubuntu_400Regular",
  },
  subText: {
    color: "#555",
    fontSize: 15,
    fontFamily: "Ubuntu_400Regular",
  },
});
