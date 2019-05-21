import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import PropTypes from 'prop-types';

const { width, height} = Dimensions.get("window");
//const { text } = this.props;

class ToDo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isEditing: false,
            toDoValue: props.value }
    }
    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired
    };
  render() {
    const { isCompleted, isEditing, toDoValue } = this.state;
    const { text, id, deleteToDo } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._togleComplete}>
            <View
              style={[
                styles.circle,
                isCompleted
                  ? styles.completedCircle
                  : styles.uncompletedCircle
              ]}
            />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              value={toDoValue}
              style={[styles.input, styles.text]}
              multiline={true}
              onChangeText={this._controlInput}
              returnKeyType={"done"}
              onBlur={this._finishEditing}
            />
          ) : (
            <Text
              style={[
                styles.text,
                isCompleted ? styles.completedText : styles.uncompletedText
              ]}
            >
              {text}
            </Text>
          )}
        </View>
        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✔️</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._startEditing}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>✏️</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPressOut={() => deleteToDo(id)}>
              <View style={styles.actionContainer}>
                <Text style={styles.actionText}>❌</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  _togleComplete = () => {
    this.setState(prevState => {
      return {
        isCompleted: !prevState.isCompleted
      };
    });
  };
  _startEditing = () => {
      this.setState({
          isEditing: true,
          toDoValue: text
      });
  };
  _finishEditing = () => {
      this.setState({
          isEditing: false
      });
  };
  _controlInput = (text) => {
      this.setState({
          toDoValue : text
      })
  }
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    circle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 3,
        marginRight: 20
    },
    completedCircle: {
        borderColor: "#bbb"
    },
    uncompletedCircle: {
        borderColor: "#e85359"
    },
    completedText: {
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    uncompletedText: {
        color: "#2c2c2c"
    },
    text: {
        fontWeight : "400",
        fontSize: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        width: width/2,
    },
    actions: {
        flexDirection: "row"
    },
    actionContainer: {
        marginVertical : 10,
        marginHorizontal: 10
    },
    input: {
        marginTop: 10,
        marginBottom: 10,
        marginVertical: 15,
        width: width /2,
        paddingBottom: 5,
        fontSize: 15
    }
});

export default ToDo;