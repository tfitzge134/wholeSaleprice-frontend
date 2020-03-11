import React, { Component } from 'react';

class Login extends Component {
  state = {
    loginDetails: {
      email: '',
      password: ''
    }
  };

  handleChange = e => {
    const loginDetails = { ...this.state.loginDetails };
    loginDetails[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ loginDetails });
  };

  handleLogin = event => {
    event.preventDefault();
    const { email, password } = this.state.loginDetails;

    fetch(`${process.env.REACT_APP_API_URL}/api/user/${email}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              email,
              password
            })
          })
            .then(res => res.json())
            .then(data => {
              if (data.msg) {
                localStorage.setItem('data', data.data._id);
                window.location = '/map';
              }
            });
        } else if (data.msg) {
          localStorage.setItem('data', data.data._id);
          window.location = '/map';
        }
      });
  };

  render() {
    return (
      <div className="login">
        <section>
          <h2>Welcome To The WholeSale Miso Project</h2>
          <form onSubmit={this.handleLogin}>
            <div>
              <input
                type="text"
                name="email"
                onChange={this.handleChange}
                placeholder="Email"
              />
              <input
                type="password"
                name="password"
                onChange={this.handleChange}
                placeholder="Password"
              />
            </div>
            <div>
              <button type="submit">Login</button>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default Login;
