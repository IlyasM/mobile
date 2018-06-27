//@flow
import React, { Component } from "react"
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity
} from "react-native"
import type { Action } from "../actions/types"
import { connect } from "react-redux"
import { authActions } from "../actions/authActions"
const WIDTH = Dimensions.get("window").width
type Props = { login: (email: string, password: string) => Action }
type State = { email: string, password: string }
class Login extends Component<Props, State> {
  static navigationOptions = { title: "Login" }
  login = () => {
    const { email, password } = this.state
    this.props.login(email.toLowerCase(), password)
  }
  componentDidUpdate() {
    if (this.props.token) {
      this.props.navigation.navigate("Home")
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <TextInput
          onChangeText={text => {
            this.setState(state => ({ email: text }))
          }}
          placeholder="email"
          style={styles.input}
        />
        <TextInput
          onChangeText={text => {
            this.setState(state => ({ password: text }))
          }}
          secureTextEntry
          placeholder="password"
          style={styles.input}
        />
        <TouchableOpacity
          onPress={this.login}
          style={[{ backgroundColor: "green" }, styles.button]}
        >
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
        {this.props.error && (
          <Text style={styles.error}>{this.props.error}</Text>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 10
  },
  input: {
    height: 36,
    width: WIDTH / 1.1,
    margin: 10,
    marginVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgb(200,200,200)"
  },

  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  },
  button: {
    height: 45,
    margin: 10,
    justifyContent: "center",
    borderRadius: 3,
    paddingHorizontal: 20
  },
  error: {
    color: "red"
  }
})
const mapStateToProps = state => ({
  token: state.auth.token,
  error: state.auth.error
})
export default connect(
  mapStateToProps,
  { login: authActions.login }
)(Login)
