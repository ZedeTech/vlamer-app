import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { Subheading } from "react-native-paper";
import { PrimaryButton } from "../common/buttons";

class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Subheading style={styles.text}> Home Page </Subheading>
        <PrimaryButton onPress={() => this.props.navigation.navigate("Login")}>
          Logout
        </PrimaryButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  text: {
    textAlign: "center",
    fontFamily: "playfair-display",
    letterSpacing: 2,
    color: "#fff",
    marginBottom: 25,
    fontSize: 25,
  },
});

export default Home;