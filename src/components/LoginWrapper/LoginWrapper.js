import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';

import './LoginWrapper.css';

import Header from '../Header/Header';
import Login from '../Login/Login';
import { userLogin, userLogOut } from '../../redux/actions/auth';
import { getBlogsFromDb } from '../../controllers/getBlogs';
import { addBlogArr } from '../../redux/actions/blogs';

class LoginWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verifying: true,
      id: '',
    };
  }

  componentWillMount() {
    const id = window.location.search.split('=')[1];
    if (id) this.setState(() => ({ id }));
    // get blogs from server
    getBlogsFromDb().then((res) => {
      if (res.error) {
        // if error or invalid token status render login page, user is logged out
        this.props.dispatch(userLogOut());
        this.setState(() => ({ verifying: false }));
      } else {
        // else redirect to dashboard page, user is already logged in
        this.props.dispatch(userLogin());
        this.props.dispatch(addBlogArr(res.blogs));
        this.setState(() => ({ verifying: false }));
      }
    });
  }

  render() {
    return this.state.verifying ? (
      <Fragment>
        <Header />
        <LinearProgress />
      </Fragment>
    ) : this.props.auth.loggedIn ? (
      <Redirect to={this.state.id !== '' ? `/create?id=${this.state.id}` : '/dashboard'} />
    ) : (
      <Fragment>
        <Header />
        <Login />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(LoginWrapper);