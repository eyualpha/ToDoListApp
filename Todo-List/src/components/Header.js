import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
const Header = (props) => {
  return (
    <View>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.titleIconContainer}>
          <Text style={styles.title}>Your Todos</Text>
          <AntDesign
            name="setting"
            size={30}
            color="white"
            onPress={() => props.helper(true)}
          />
        </View>
      </View>
    </View>
  );
};
export default Header;

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: "#1C588C",
    justifyContent: "flex-end",
    marginBottom: 0,
  },
 
});


