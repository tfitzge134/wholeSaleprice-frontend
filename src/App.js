import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/Login.jsx';
import Map from './components/Map';

class App extends Component {
  state = {
    features: []
  };

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
            path="/map"
            render={props => {
              if (_id) return <Map {...props}/>;
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
