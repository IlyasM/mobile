import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import { connect } from "react-redux";

class SignUp extends Component {
   render() {
      return (
         <View>
            <Text> {this.props.text} </Text>
         </View>
      );
   }
}
const mapStateToProps = state => ({
   text: state.chat.life
});
export default connect(mapStateToProps)(SignUp);
const styles = StyleSheet.create({});
