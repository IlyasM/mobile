//@flow
import React, { Component } from "react"
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native"
import FadeIn from "./fade"
import type { User, Message } from "../dataTypes"
type Props = {
  item: { user: User, message: Message, typing: boolean },
  me: User,
  toChat: (item: Object) => VoidFunction
}
const WIDTH = Dimensions.get("window").width
export default ({
  item: { user, message, typing, unseenCount },
  toChat,
  me
}: Props) => {
  return (
    <TouchableOpacity onPress={toChat}>
      <View style={styles.container}>
        <FadeIn style={styles.image} source={{ uri: user.image }} />
        <View style={styles.description}>
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.notif}>
            <Text style={styles.lastMessage}>
              {typing ? "typing..." : message.text}
            </Text>
            {message.author_id !== me.id &&
              unseenCount > 0 && (
                <View style={styles.circle}>
                  <Text style={styles.count}>{unseenCount}</Text>
                </View>
              )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    paddingLeft: 3,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 5
  },
  description: {
    alignItems: "flex-start",
    justifyContent: "space-around",
    height: 46
  },
  notif: {
    flexDirection: "row",
    width: WIDTH / 1.3,
    justifyContent: "space-between"
  },
  count: {
    color: "white"
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red"
  },
  name: {
    fontSize: 16,
    fontWeight: "500"
  },
  lastMessage: {
    fontSize: 15,
    color: "rgb(150,150,150)"
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 20,
    borderRadius: 25
  }
})
