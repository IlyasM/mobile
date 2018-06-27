//@flow
import React, { Component } from "react"
import { View, Text } from "react-native"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import type { NavigationScreenProp, NavigationState } from "react-navigation"
import Loading from "../components/loading"

type Props = {
  navigation: NavigationScreenProp<NavigationState>,
  token: ?string
}
class AuthLoading extends Component<Props> {
  componentDidMount() {
    let { navigation, token } = this.props
    navigation.navigate(token ? "Home" : "Auth")
  }

  render() {
    return <Loading />
  }
}

const mapStateToProps = state => ({
  token: state.auth.token
})

export default connect(mapStateToProps)(AuthLoading)
