import React, { Component } from "react"
import {
  Text,
  StyleSheet,
  View,
  Image,
  Animated,
  LayoutAnimation
} from "react-native"
export default class FadeImage extends Component {
  state = {
    opacity: new Animated.Value(0)
  }

  _onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  render() {
    return (
      <View>
        <Animated.Image
          onLoad={this._onLoad}
          {...this.props}
          style={[
            {
              transform: [
                {
                  scale: this.state.opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1]
                  })
                }
              ]
            },
            this.props.style
          ]}
        />
        <Animated.View
          style={[
            styles.placeholder,
            {
              backgroundColor: "rgb(200,200,200)",
              opacity: this.state.opacity.interpolate({
                inputRange: [0, 0.5],
                outputRange: [1, 0]
              })
            },
            this.props.style
          ]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  placeholder: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center"
  }
})
