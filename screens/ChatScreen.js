import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
} from "react-native";
import { Text, Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as firebase from "firebase";
import { auth, db } from "../firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      //   title: route.params.chatName,
      //   headerStyle: { backgroundColor: "#fff" },
      //   headerTitleStyle: { color: "black" },
      //   headerTintColor: "black",
      //   headerBackTitle: "Chats",
      headerTitleAlign: "left",
      headerBackTitleVisible: false,
      headerTitle: () => (
        // heade title fun can over lap the title

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri:
                messages[0]?.data.photoURL ||
                "https://image.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg",
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => {
        return (
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={navigation.goBack}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
        );
      },

      headerRight: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: 80,
              justifyContent: "space-between",
              marginRight: 15,
            }}
          >
            <TouchableOpacity>
              <FontAwesome name="video-camera" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="call" size={24} color="white" />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation, messages]);

  useLayoutEffect(() => {
    //   ceate a listner
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapShot) =>
        setMessages(
          snapShot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    //   cleanup fun
    return unsubscribe;
  }, [route]);

  const sendMessage = () => {
    Keyboard.dismiss;

    // alert("user name is --", auth.currentUser.displayName);
    let documentIdOrChannelID = route.params.id;
    // we assume documentID as Channel ID , so we can store all the chats againts a channel
    // every channel have different people
    db.collection("chats")
      .doc(documentIdOrChannelID)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        messages: input,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
      })
      .then((resp) => {
        setInput("");

        // console.log(JSON.stringify(resp));
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  const MyMessages = ({ id, data }) => (
    <View key={id} style={styles.myMsg}>
      <Avatar
        position="absolute"
        bottom={-15}
        right={-5}
        // for web uper style does not work

        containerStyle={{
          position: "absolute",
          right: -5,
          bottom: -15,
        }}
        size={30}
        source={{ uri: data.photoURL }}
        rounded
      />
      <Text style={styles.myMsgTxt}>{data.messages}</Text>
    </View>
  );

  const OtherUserMessages = ({ id, data }) => (
    <View key={id} style={styles.otherMsg}>
      <Avatar
        position="absolute"
        bottom={-15}
        right={-5}
        // for web uper style does not work

        containerStyle={{
          position: "absolute",
          left: -5,
          bottom: -15,
        }}
        size={30}
        source={{ uri: data.photoURL }}
        rounded
      />

      <Text style={styles.otherMsgTxt}>{data.messages}</Text>
      {data.displayName ? (
        <Text
          style={{
            ...styles.otherMsgTxt,
            marginTop: 5,
            fontWeight: "600",
            marginBottom: 5,
            color: "white",
            fontSize: 12,
          }}
        >
          {data.displayName}
        </Text>
      ) : (
        ""
      )}
    </View>
  );

  //   now we can get user chat with two method one ny using useLayoutEffect or useEffect

  //   we are depend on route as route have chatName & ID

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ marginTop: 10 }}>
              {/* all chats are here  */}

              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <MyMessages key={id} id={id} data={data} />
                ) : (
                  <OtherUserMessages key={id} id={id} data={data} />
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder="Enter your message"
                style={styles.inputStyle}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
                value={input}
              />
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#0077ff" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  footer: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
  },
  inputStyle: {
    backgroundColor: "#ECECEC",
    flex: 1,
    borderRadius: 25,
    padding: 10,
    marginRight: 5,
    color: "grey",
    height: 40,
    bottom: 0,
    borderColor: "transparent",
  },
  myMsg: {
    padding: 15,
    alignSelf: "flex-end",
    marginRight: 15,
    borderRadius: 20,
    marginBottom: 25,
    position: "relative",
    maxWidth: "80%",
    backgroundColor: "#ECECEC",
  },
  myMsgTxt: {},
  otherMsg: {
    padding: 15,
    alignSelf: "flex-start",
    marginLeft: 15,
    borderRadius: 20,
    marginBottom: 25,
    position: "relative",
    maxWidth: "80%",
    backgroundColor: "#2868E6",
    // minWidth: "15%",
  },
  otherMsgTxt: {
    color: "white",
  },
});

export default ChatScreen;
