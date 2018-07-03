//@flow
import React, { Component } from "react"
import { Text, StyleSheet, View, Dimensions } from "react-native"

let green = "#dcf8c6"
let grey = "rgb(220,220,220)"
const WIDTH = Dimensions.get("window").width
export default ({ item, next, me }) => {
  const isMe = item.author_id === me.id
  const marginTop = next && item.author_id === next.author_id ? 0 : 16

  return (
    <View
      style={[styles.root, { alignItems: isMe ? "flex-end" : "flex-start" }]}
    >
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
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {},
  container: {
    paddingVertical: 10,
    padding: 12,
    marginHorizontal: 12,
    borderRadius: 5,
    maxWidth: WIDTH / 1.5
    //  shadowColor: "rgb(20,20,20)",
    //  shadowOffset: { height: 2, width: 1 },
    //  shadowOpacity: 0.1,
    //  shadowRadius: 5
  },
  text: {
    fontSize: 16
  }
})
