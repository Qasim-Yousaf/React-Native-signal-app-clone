import React, { useEffect, useLayoutEffect, useState } from "react";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import CustomListItem from "../components/CustomListItem";
import { View, TouchableOpacity } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { auth, db } from "../firebase";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  const signOut = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };
  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id: id,
      chatName: chatName,
    });
  };

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot((snapshot) => {
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Signal",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerRight: () => {
        return (
          <View
            style={{
              marginRight: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              width: 80,
            }}
          >
            <TouchableOpacity activeOpacity={0.5}>
              <AntDesign name="camera" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate("AddChat");
              }}
            >
              <SimpleLineIcons name="pencil" color="black" size={24} />
            </TouchableOpacity>
          </View>
        );
      },
      headerLeft: () => {
        return (
          <View
            style={{
              marginLeft: 15,
              borderWidth: 3,
              borderRadius: 20,
              borderColor: "#0077ff",
            }}
          >
            <TouchableOpacity onPress={signOut}>
              <Avatar
                rounded
                source={{
                  uri:
                    auth?.currentUser?.photoURL ||
                    "https://image.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg",
                }}
              />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation]);
  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => {
          return (
            <CustomListItem
              id={id}
              key={id}
              chatName={chatName}
              enterChat={enterChat}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});

export default HomeScreen;
