//@flow
import React, { Component } from "react"
import { Text, StyleSheet, View, Dimensions } from "react-native"
import Ioincons from "react-native-vector-icons/Ionicons"
let green = "#dcf8c6"
let grey = "rgb(220,220,220)"
const WIDTH = Dimensions.get("window").width
import type { Message, User } from "../dataTypes"
type Props = {
  item: Message,
  next: Message,
  me: User
}
export default ({ item, next, me }: Props) => {
  const isMe = item.author_id === me.id
  const marginTop = next && item.author_id === next.author_id ? 0 : 16
  let color
  if (item.status === "saved" || item.status === "received") {
    color = "rgb(150,150,150)"
  } else {
    color = "blue"
  }
  return (
    <View style={{ alignItems: isMe ? "flex-end" : "flex-start" }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isMe ? green : grey,
            marginTop,
            marginBottom: 3
          }
        ]}
      >
        <View>
          <Text style={styles.text}>{item.text}</Text>
          {isMe && (
            <View style={styles.status}>
              <View style={styles.marks}>
                <Ioincons color={color} size={20} name="ios-checkmark" />
                {item.status !== "saved" && (
                  <Ioincons color={color} size={20} name="ios-checkmark" />
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    padding: 12,
    marginHorizontal: 12,
    borderRadius: 5,
    maxWidth: WIDTH / 1.5
  },
  status: {
    position: "absolute",
    bottom: -15,
    right: -10
  },
  marks: {
    flexDirection: "row"
  },
  text: {
    fontSize: 16
  }
})
