//@flow
import React, { Component } from "react"
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  LayoutAnimation,
  Dimensions
} from "react-native"
import { connect } from "react-redux"
import { homeActions as actions } from "../actions/homeActions"
import type { Action } from "../actions/types"
import HomeItem from "../components/homeItem"
import Loading from "../components/loading"
const WIDTH = Dimensions.get("window").width
type Props = {
  connect: () => Action,
  dataSource: Array<Object>,
  users: Object
}
class Home extends Component<Props> {
  static navigationOptions = {
    title: "Home"
  }
  componentDidMount() {
    this.props.navigation.addListener("willFocus", route => {
      this.props.connect()
    })
  }
  componentWillUnmount() {
    this.props.navigation.removeListener("willFocus")
  }
  goToChat = item => {
    this.props.navigation.navigate("Chat", { item })
  }

  renderItem = ({ item }) => {
    return (
      <HomeItem
        me={this.props.me}
        toChat={() => this.goToChat(item)}
        item={item}
      />
    )
  }
  renderSeparator = () => <View style={styles.separator} />

  render() {
    const { dataSource } = this.props
    if (!dataSource || dataSource.length < 1) {
      return <Loading />
    }

    return (
      <FlatList
        style={styles.root}
        ItemSeparatorComponent={this.renderSeparator}
        data={dataSource}
        renderItem={this.renderItem}
        keyExtractor={i => `${i.chatID}`}
      />
    )
  }
}

export default connect(
  ({ home: { dataSource }, auth: { user } }) => ({
    dataSource,
    me: user
  }),
  { connect: actions.connect }
)(Home)

const styles = StyleSheet.create({
  root: { backgroundColor: "white", flex: 1 },
  separator: {
    height: 0.5,
    width: WIDTH / 1.2,
    marginLeft: 60,
    backgroundColor: "rgb(200,200,200)"
  }
})
