import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../firebase";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Add a new Chat",
      headerBackTitle: "Chats",

      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
    });
  }, [navigation]);

  const CreateChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  return (
    <View style={style.container}>
      <Input
        placeholder="Enter chat name"
        textContentType="name"
        value={input}
        onChangeText={(text) => setInput(text)}
        onSubmitEditing={CreateChat}
        leftIcon={
          <Icon name="wechat" type="antdesign" size={24} color="black" />
        }
      />
      <Button disabled={!input} title="Add a new Chat" onPress={CreateChat} />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});

export default AddChatScreen;
