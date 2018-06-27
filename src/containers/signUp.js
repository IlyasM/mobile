//@flow
import React, { Component } from "react"
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Button,
  TouchableOpacity
} from "react-native"
import type { Action } from "../actions/types"
import { connect } from "react-redux"
import { authActions } from "../actions/authActions"
const WIDTH = Dimensions.get("window").width
type Props = {
  navigation: Object,
  signedUp: boolean,
  error: ?{ email: Array<string> },
  signUp: (name: string, email: string, password: string) => Action
}
type State = {
  email: string,
  name: string,
  password: string
}
class SignUp extends Component<Props, State> {
  static navigationOptions = { title: "Sign Up" }

  goToLogin = () => {
    this.props.navigation.navigate("Login")
  }
  signUp = () => {
    const { name, email, password } = this.state
    this.props.signUp(name, email.toLowerCase(), password)
  }

  render() {
    return (
      <View style={styles.root}>
        <TextInput
          onChangeText={text => {
            this.setState(state => ({ name: text }))
          }}
          placeholder="name"
          style={styles.input}
        />
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
          onPress={this.signUp}
          style={[{ backgroundColor: "blue" }, styles.button]}
        >
          <Text style={styles.text}>Sign Up</Text>
        </TouchableOpacity>

        <Button onPress={this.goToLogin} title="Already have an account? " />
        {this.props.signedUp && (
          <Text style={styles.success}>
            You successfully created an account!
          </Text>
        )}
        {this.props.error &&
          this.props.error.email.map(err => (
            <Text style={styles.error} key={err}>
              Email {err}
            </Text>
          ))}
      </View>
    )
  }
}
export default connect(
  ({ auth: { error, signedUp } }) => ({ error, signedUp }),
  { signUp: authActions.signUp }
)(SignUp)

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
    color: "red",
    margin: 5
  },
  success: {
    color: "green"
  }
})
