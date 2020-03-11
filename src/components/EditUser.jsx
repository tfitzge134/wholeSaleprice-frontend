import React, { Component } from 'react';

class EditUser extends Component {
  state = {
    loginDetails: {
      email: '',
      password: ''
    }
  };

  componentDidMount() {
    const id = localStorage.getItem('data');
    fetch(`${process.env.REACT_APP_API_URL}/api/user/single/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          loginDetails: {
            email: data.email
          }
        });
        console.log(data.email);
      });
  }

  handleChange = e => {
    const loginDetails = { ...this.state.loginDetails };
    loginDetails[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ loginDetails });
  };

  handleEdit = event => {
    event.preventDefault();
    const id = localStorage.getItem('data');
    const { email, password } = this.state.loginDetails;

    fetch(`${process.env.REACT_APP_API_URL}/api/user/${id}`, {
      method: 'PUT',
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
          window.location = '/map';
        }
      });
  };

  render() {
    const { email, password } = this.state.loginDetails;
    return (
      <div className="login">
        <section>
          <h2>Edit User Details</h2>
          <form onSubmit={this.handleEdit}>
            <div>
              <input
                type="text"
                name="email"
                onChange={this.handleChange}
                placeholder="Email"
                value={email}
              />
              <input
                type="password"
                name="password"
                onChange={this.handleChange}
                placeholder="Password"
              />
            </div>
            <div>
              <button type="submit">Edit</button>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default EditUser;
