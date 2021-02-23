import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Image, Input } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";
import { Platform } from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });

    // return clean up function

    return unsubscribe;
  });
  const signIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("user login sucessfully.");
      })
      .catch((e) => {
        alert(e.message);
      });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Image
        source={{
          uri:
            "https://upload.wikimedia.org/wikipedia/commons/4/4f/Signal_Blue_Icon.png",
        }}
        style={styles.img}
        PlaceholderContent={<ActivityIndicator />}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autoFocus
          textContentType="emailAddress"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          textContentType="password"
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
      </View>
      <Button title="Login" containerStyle={styles.button} onPress={signIn} />
      <Button
        title="Register"
        type="outline"
        containerStyle={styles.button}
        onPress={() => navigation.navigate("Register")}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  inputContainer: { width: 300 },
  button: { width: 200, marginTop: 10 },
});

export default LoginScreen;
