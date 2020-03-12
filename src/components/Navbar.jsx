import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  state = {};

  handleDelete = e => {
    const id = localStorage.getItem('data');
    fetch(`${process.env.REACT_APP_API_URL}/api/user/${id}`, {
      method: 'Delete'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.clear();
          window.location = '/';
        }
      });
  };

  handleLogout() {
    localStorage.clear();
    window.location = '/';
  }

  render() {
    return (
      <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
        <Link class="navbar-brand" href="#">
          Miso
        </Link>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
              <Link class="nav-link btn btn-primary" to="/edit">
                Edit User <span class="sr-only">(current)</span>
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link btn btn-danger" onClick={this.handleDelete}>
                Delete User
              </Link>
            </li>
            <li class="nav-item">
              <Link class="nav-link btn btn-danger" onClick={this.handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
