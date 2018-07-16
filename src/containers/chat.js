//@flow
import React, { Component } from "react"
import {
  Text,
  StyleSheet,
  View,
  LayoutAnimation,
  KeyboardAvoidingView,
  FlatList
} from "react-native"
import { connect } from "react-redux"
import MessageInput from "../components/messageInput"
import MessageItem from "../components/messageItem"
import { chatActions } from "../actions/chatActions"
import Loading from "../components/loading"
import type { User, Message } from "../dataTypes"
import type { Action } from "../actions/types"

type Props = {
  navigation: Object,
  me: User,
  chats: Object,
  joinConversation: (chat_id: number, last_seen_id: number) => Action,
  newMessage: (text: string, author_id: number, chat_id: number) => Action,
  pushTyping: (chat_id: number) => Action
}

class Chat extends Component<Props> {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("item").user.name
  })
  componentDidMount() {
    const item = this.props.navigation.getParam("item")
    const { chatID, message } = item
    this.props.joinConversation(chatID, message.id)
  }
  componentDidUpdate() {
    LayoutAnimation.easeInEaseOut()
  }

  renderItem = ({ item }) => {
    let next
    const items = this.props.chats[item.chat_id].messages
    const index = items.indexOf(item)
    if (index + 1 == items.length) {
      next = null
    } else {
      next = items[index + 1]
    }

    return <MessageItem me={this.props.me} item={item} next={next} />
  }

  render() {
    const item = this.props.navigation.getParam("item")
    const { chatID, message } = item
    const chat = this.props.chats[chatID]
    if (!chat) {
      return <Loading />
    }

    const { pushTyping, newMessage, me } = this.props
    const messages = chat.messages
    const typing = chat.typing
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={64}
        behavior="padding"
        style={styles.root}
      >
        <FlatList
          data={messages}
          renderItem={this.renderItem}
          inverted
          keyExtractor={i => `${i.id}`}
          scrollsToTop={false}
        />
        {typing && <Text style={styles.typing}>typing...</Text>}
        <MessageInput
          chatID={chatID}
          me={me}
          typing={pushTyping}
          createMessage={newMessage}
        />
      </KeyboardAvoidingView>
    )
  }
}

export default connect(
  ({ auth: { user }, chat: { chats } }) => ({
    me: user,
    chats
  }),
  { ...chatActions }
)(Chat)

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "white" },
  typing: {
    color: "rgb(200,200,200)",
    margin: 15,
    fontSize: 15,
    fontWeight: "500"
  }
})
