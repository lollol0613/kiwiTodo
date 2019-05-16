import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView } from 'react-native';
import Todo from "./ToDo";
import { AppLoading } from 'expo';
const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTodo: "",
    loadedToDos: false
  };
  componentDidMount = () => {
    this._loadToDos();
  };
  render() {
    const { newTodo, loadedToDos } = this.state;
    if(!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>KIWI TODO</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input}
            placeholder={"New To Do"}
            value={newTodo}
            onChangeText={this._controlnewTodo}
            returnKeyType={"done"}
            autoCorrect={false}/> 
            <ScrollView contentContainerStyle={styles.toDos}>
             <Todo text={"Hello, I'm a To Do"}/>
            </ScrollView>
        </View>
      </View>
    );
  }
  _controlnewTodo = text => {
    this.setState({
      newTodo: text
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e85359',
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: "400",
    marginTop: 80,
    marginBottom: 50
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width-25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      andorid: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: "center"
  }
});
