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
  static hasBeenLoaded = false

  _onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  render() {
    const { firstLetter } = this.props
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
        >
          <Text style={styles.text}>{firstLetter}</Text>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  placeholder: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 25,
    color: "rgb(50,50,50)"
  }
})
