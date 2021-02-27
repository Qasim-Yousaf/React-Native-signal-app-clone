import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Platform } from "react-native";
import { ListItem, Avatar, Text } from "react-native-elements";
import { db } from "../firebase";

const CustomListItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // console.warn("call server");
    const unsubscribe = db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapShot) => {
        setChatMessages(snapShot.docs.map((doc) => doc.data()));
      });

    return unsubscribe;
  }, []);

  return (
    <ListItem
      onPress={() => enterChat(id, chatName)}
      bottomDivider
      style={{ marginBottom: 0 }}
      key={id}
    >
      <Avatar
        rounded
        source={{
          uri:
            chatMessages?.[0]?.photoURL ||
            "https://image.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.[0]?.displayName
            ? chatMessages[0].displayName + " :"
            : ""}{" "}
          {chatMessages?.[0]?.messages}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default CustomListItem;
