import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage
} from "react-native";
import ToDo from "./ToDo";
import { AppLoading } from 'expo';
import uuidv1 from 'uuid/v1';


//const date = new Date();
const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  };
}
  componentDidMount = () => {
    this._loadToDos();
  } 
  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    if(!loadedToDos) {
      return (
      <AppLoading>
        <StatusBar barStyle="light-content"/> 
      </AppLoading>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>KIWI TODO</Text>
        <View style={styles.card}>
          <TextInput
            value={newToDo}
            style={styles.input}
            placeholder={"New To Do"}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            blurOnSubmit={true}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).reverse().map(toDo => (
              <ToDo 
              key={toDo.id} 
              deleteToDo={this._deleteToDo}
              uncomplete={this._uncompleteToDo}
              complete={this._completeToDo}
              updateToDo={this._updateToDo}
              {...toDo}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };
  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      if (toDos) {
        const parsedToDos = JSON.parse(toDos);
        this.setState({
          loadedToDos: true,
          toDos: parsedToDos
        });
      } else {
        this.setState({
          loadedToDos: true,
          toDos: {}
        });
      }
    } catch(err) {
      console.log(err);
    }
  };
  _addToDo = async () => {
    const { newToDo, toDos } = this.state;
    if(newToDo !== "") {
      this.setState({
        newToDo: ""
      });
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID] : {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: new Date()
          }
        };
        const newState = {
          ...prevState,
          toDos: {
            ...prevState.toDos,
            ...newToDoObject 
          }};
          this._saveState(newState.toDos);
          return { ...newState };
      });
    }
  };
  _deleteToDo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveState(newState.toDos);
      return { ...newState };
    });
  };
  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
        [id]: {
          ...prevState.toDos[id],
          isCompleted: false
        }
        }
      };
      this._saveState(newState.toDos);
      return { ...newState };
    });
  };
  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
        [id]: {
          ...prevState.toDos[id],
          isCompleted: true
        }
        }
      };
      this._saveState(newState.toDos);
      return { ...newState };
    });
  };
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
        [id]: {
          ...prevState.toDos[id],
          text }
        }
      };
      this._saveState(newState.toDos);
      return { ...newState };
    });
  };
  _saveState = newToDos => {
    const saveState = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
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
