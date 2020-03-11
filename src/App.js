import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/Login.jsx';
import Map from './components/Map';
import EditUser from './components/EditUser.jsx';

class App extends Component {
  state = {};

  componentDidMount() {
    try {
      const _id = localStorage.getItem('data');
      this.setState({ _id });
    } catch (error) {}
  }

  render() {
    const { _id } = this.state;
    return (
      <React.Fragment>
        <Switch>
          <Route
            path="/edit"
            render={props => {
              if (_id) return <EditUser {...props} />;
              return <Redirect to="/" />;
            }}
          />
          <Route
            path="/map"
            render={props => {
              if (_id) return <Map {...props} />;
              return <Redirect to="/" />;
            }}
          />
          <Route
            path="/"
            render={props => {
              if (!_id) return <Login {...props} />;
              return <Redirect to="/map" />;
            }}
            exact
          />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
