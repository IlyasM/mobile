import React, { Component } from "react"
import { Text, StyleSheet, View } from "react-native"

type Props = {}
export default class loading extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        <Text> Loading... </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  }
})
