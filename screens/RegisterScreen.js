import React, { useState, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Image, Input, Text } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";
import { Platform } from "react-native";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [imageURL, setimageURL] = useState("");
  const [loading, setLoading] = useState(false);

  // call this function before the screen render , or paint OR we can use onFocuse
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: " ",
    });
  }, [navigation]);

  const register = () => {
    // console.log("Submit form");
    console.log("user name ----- ", name);
    console.log("user email ----- ", email);
    console.log("user imageURL ----- ", imageURL);

    setLoading(true);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        // console.log(
        //   "User account created & signed in!----> ",
        //   JSON.stringify(authUser.user)
        // );

        alert("user created");
        authUser.user
          .updateProfile({
            displayName: name,
            email: email,
            photoURL:
              imageURL ||
              "https://image.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg",
          })
          .then(() => {
            console.log(
              "user after update profile  is -------------",
              JSON.stringify(authUser.user)
            );
          })
          .catch((e) => {
            alert(e.message);
          });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);

        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        alert(error.message);
      });
  };

  // if (loading === true) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />

      <Text h3 style={styles.heading}>
        Create a Signal Account
      </Text>

      <View style={styles.inputContainer}>
        <Input
          placeholder="Fullname"
          autoFocus
          textContentType="username"
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <Input
          placeholder="Email"
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

        <Input
          placeholder="Profile Image URL (optional)"
          textContentType="username"
          onChangeText={(text) => setimageURL(text)}
          value={imageURL}
          onSubmitEditing={register}
        />
      </View>
      <Button
        containerStyle={styles.button}
        title="Register"
        onPress={register}
        raised
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
  heading: {
    marginBottom: 50,
  },
  inputContainer: { width: 300 },
  button: { width: 200, marginTop: 10 },
});

export default RegisterScreen;
