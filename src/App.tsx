import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import EventContainer from "./containers/eventcontainer";

class App extends Component {
  public render() {
    return (
      <Provider store={store}>
        <div className="App">
          <EventContainer />
        </div>
      </Provider>
    );
  }
}

export default App;
