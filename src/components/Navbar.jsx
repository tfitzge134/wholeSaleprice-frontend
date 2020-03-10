import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  state = {};

  handleDelete = e => {
    const id = localStorage.getItem('data');
    fetch(`http://localhost:5000/api/user/${id}`, {
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
      <nav className="navbar">
        <div className="inner">
          <div>
            <h2>Miso</h2>
          </div>
          <div>
            <Link to="/edit">Edit User</Link>
            <button onClick={this.handleDelete}>Delete User</button>
            <button onClick={this.handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
