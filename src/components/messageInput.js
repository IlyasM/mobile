import React, { Component } from "react"
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
const color = "rgb(180,180,180)"
const WIDTH = Dimensions.get("window").width

export default class MessageInput extends React.Component {
  state = {
    text: "",
    height: 30,
    showSlider: false
  }

  _onChangeText = text => {
    LayoutAnimation.easeInEaseOut()
    this.setState({
      text
    })
    this.props.typing(this.props.chatID)
  }
  _onContentSizeChange = event => {
    LayoutAnimation.easeInEaseOut()
    this.setState({
      height: event.nativeEvent.contentSize.height
    })
  }

  _onSend = () => {
    if (this.state.text.trim() === "") {
      return
    }
    this.props.createMessage(
      this.state.text.trim(),
      this.props.me.id,
      this.props.chatID
    )
    this.setState(state => ({ text: "" }))
  }
  renderSendButton = () => {
    const color =
      this.state.text.trim() === "" ? "rgb(150,150,150)" : "rgb(70,70,70)"
    return <Ionicons name={"ios-send"} size={32} color={color} />
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          { height: Math.min(Math.max(48, this.state.height + 14), 158) }
        ]}
      >
        <View style={[styles.inputWrap]}>
          <TextInput
            style={[
              styles.textInput,
              { height: Math.min(Math.max(30, this.state.height), 140) }
            ]}
            value={this.state.text}
            onChangeText={this._onChangeText}
            onContentSizeChange={this._onContentSizeChange}
            placeholderTextColor={color}
            multiline
          />
        </View>
        <TouchableOpacity onPress={this._onSend} style={styles.buttonWrap}>
          {this.renderSendButton()}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(246,246,246)",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "rgb(220,220,220)"
  },
  inputWrap: {
    paddingVertical: 2,
    flex: 4,
    flexDirection: "row",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    borderColor: "rgb(200,200,200)",
    alignItems: "center",
    borderRadius: 4
  },
  buttonWrap: {
    flex: 0.4
  },

  textInput: {
    flex: 1,
    fontWeight: "500",
    fontSize: 16,
    height: 36,
    color: "rgb(90,90,90)"
  }
})
