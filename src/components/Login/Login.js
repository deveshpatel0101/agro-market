import React from 'react';
import './Login.css';
import { TextField, Button } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import GoogleLogin from 'react-google-login';

import { postLoginData } from '../../controllers/loginController';
import { googleAuthLogin } from '../../controllers/googleAuthController';
import { userLogin } from '../../redux/actions/user';
import { addItemsArr } from '../../redux/actions/items';
import { errorMessage } from '../../redux/actions/message';
import secrets from '../../secret';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorEmail: '',
      errorPassword: '',
      id: null,
      redirect: false,
    };
  }

  handleEmailChange = (e) => {
    const temp = e.target.value;
    this.setState({ email: temp, errorEmail: false });
  };

  handlePasswordChange = (e) => {
    const temp = e.target.value;
    this.setState({ password: temp, errorPassword: false });
  };

  handleSubmit = (e) => {
    // will show errors depending on values of text fields and if everything is perfect dispatch user login
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    // send login data to server
    postLoginData({ email, password }).then((res) => {
      const { error, errorType, errorMessage: error_msg } = res;
      if (error && errorType === 'email') {
        this.setState({ errorEmail: error_msg });
      } else if (error && errorType === 'password') {
        this.setState({ errorPassword: error_msg });
      } else if (error) {
        this.props.dispatch(
          errorMessage(
            'Oops! Something went wrong. This might be an API error. Report the error here or try refreshing the page.',
            res.errorMessage,
          ),
        );
      } else {
        // successful login
        localStorage.setItem('loginToken', res.jwtToken);
        this.props.dispatch(addItemsArr(res.items));
        this.props.dispatch(userLogin());
      }
    });
  };

  responseGoogle = (response) => {
    if (!response.error) {
      let user = {
        accessToken: response.accessToken,
      };
      googleAuthLogin(user).then((res) => {
        if (res.errorType === 'email') {
          this.props.dispatch(errorMessage('User does not exists!', res.errorMessage));
          this.setState({ redirect: 'signup' });
        } else if (!res.error) {
          localStorage.setItem('loginToken', res.jwtToken);
          this.props.dispatch(addItemsArr(res.items));
          this.props.dispatch(userLogin());
        } else {
          this.props.dispatch(
            errorMessage(
              'Oops! Something went wrong. This might be an API error. Report the error here or try refreshing the page.',
              res.errorMessage,
            ),
          );
        }
      });
    }
  };

  render() {
    const { email, errorEmail, password, errorPassword } = this.state;
    return this.state.redirect === 'signup' ? (
      <Redirect to='/user/register' />
    ) : (
      <div className='login-form'>
        <form method='POST' onSubmit={this.handleSubmit}>
          <div className='email-field'>
            <TextField
              id='email'
              label='Email'
              margin='normal'
              name='email'
              fullWidth
              onChange={this.handleEmailChange}
              error={errorEmail ? true : false}
              helperText={errorEmail && errorEmail}
              value={email}
            />
          </div>

          <div className='password-field'>
            <TextField
              id='password-input'
              label='Password'
              type='password'
              margin='normal'
              name='password'
              fullWidth
              onChange={this.handlePasswordChange}
              error={errorPassword ? true : false}
              helperText={errorPassword && errorPassword}
              value={password}
            />
          </div>

          <div className='form-login-button'>
            <Button size='small' variant='outlined' fullWidth type='submit'>
              Login
            </Button>
          </div>

          <div className='new-user'>
            <Link to='/user/register'>
              <Button size='small' variant='outlined' fullWidth>
                Sign up
              </Button>
            </Link>
          </div>

          <div className='third-party-login'>
            <GoogleLogin
              clientId={secrets.GOOGLE_CLIENT_ID}
              buttonText='Login'
              render={(renderProps) => (
                <Button onClick={renderProps.onClick} size='small' variant='outlined' fullWidth>
                  <img
                    alt='google logo'
                    src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IgogICAgIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIKICAgICB2aWV3Qm94PSIwIDAgNDggNDgiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDsiPjxnIGlkPSJzdXJmYWNlMSI+PHBhdGggc3R5bGU9IiBmaWxsOiNGRkMxMDc7IiBkPSJNIDQzLjYwOTM3NSAyMC4wODIwMzEgTCA0MiAyMC4wODIwMzEgTCA0MiAyMCBMIDI0IDIwIEwgMjQgMjggTCAzNS4zMDQ2ODggMjggQyAzMy42NTIzNDQgMzIuNjU2MjUgMjkuMjIyNjU2IDM2IDI0IDM2IEMgMTcuMzcxMDk0IDM2IDEyIDMwLjYyODkwNiAxMiAyNCBDIDEyIDE3LjM3MTA5NCAxNy4zNzEwOTQgMTIgMjQgMTIgQyAyNy4wNTg1OTQgMTIgMjkuODQzNzUgMTMuMTUyMzQ0IDMxLjk2MDkzOCAxNS4wMzkwNjMgTCAzNy42MTcxODggOS4zODI4MTMgQyAzNC4wNDY4NzUgNi4wNTQ2ODggMjkuMjY5NTMxIDQgMjQgNCBDIDEyLjk1MzEyNSA0IDQgMTIuOTUzMTI1IDQgMjQgQyA0IDM1LjA0Njg3NSAxMi45NTMxMjUgNDQgMjQgNDQgQyAzNS4wNDY4NzUgNDQgNDQgMzUuMDQ2ODc1IDQ0IDI0IEMgNDQgMjIuNjYwMTU2IDQzLjg2MzI4MSAyMS4zNTE1NjMgNDMuNjA5Mzc1IDIwLjA4MjAzMSBaICI+PC9wYXRoPjxwYXRoIHN0eWxlPSIgZmlsbDojRkYzRDAwOyIgZD0iTSA2LjMwNDY4OCAxNC42OTE0MDYgTCAxMi44Nzg5MDYgMTkuNTExNzE5IEMgMTQuNjU2MjUgMTUuMTA5Mzc1IDE4Ljk2MDkzOCAxMiAyNCAxMiBDIDI3LjA1ODU5NCAxMiAyOS44NDM3NSAxMy4xNTIzNDQgMzEuOTYwOTM4IDE1LjAzOTA2MyBMIDM3LjYxNzE4OCA5LjM4MjgxMyBDIDM0LjA0Njg3NSA2LjA1NDY4OCAyOS4yNjk1MzEgNCAyNCA0IEMgMTYuMzE2NDA2IDQgOS42NTYyNSA4LjMzNTkzOCA2LjMwNDY4OCAxNC42OTE0MDYgWiAiPjwvcGF0aD48cGF0aCBzdHlsZT0iIGZpbGw6IzRDQUY1MDsiIGQ9Ik0gMjQgNDQgQyAyOS4xNjQwNjMgNDQgMzMuODU5Mzc1IDQyLjAyMzQzOCAzNy40MTAxNTYgMzguODA4NTk0IEwgMzEuMjE4NzUgMzMuNTcwMzEzIEMgMjkuMjEwOTM4IDM1LjA4OTg0NCAyNi43MTQ4NDQgMzYgMjQgMzYgQyAxOC43OTY4NzUgMzYgMTQuMzgyODEzIDMyLjY4MzU5NCAxMi43MTg3NSAyOC4wNTQ2ODggTCA2LjE5NTMxMyAzMy4wNzgxMjUgQyA5LjUwMzkwNiAzOS41NTQ2ODggMTYuMjI2NTYzIDQ0IDI0IDQ0IFogIj48L3BhdGg+PHBhdGggc3R5bGU9IiBmaWxsOiMxOTc2RDI7IiBkPSJNIDQzLjYwOTM3NSAyMC4wODIwMzEgTCA0MiAyMC4wODIwMzEgTCA0MiAyMCBMIDI0IDIwIEwgMjQgMjggTCAzNS4zMDQ2ODggMjggQyAzNC41MTE3MTkgMzAuMjM4MjgxIDMzLjA3MDMxMyAzMi4xNjQwNjMgMzEuMjE0ODQ0IDMzLjU3MDMxMyBDIDMxLjIxODc1IDMzLjU3MDMxMyAzMS4yMTg3NSAzMy41NzAzMTMgMzEuMjE4NzUgMzMuNTcwMzEzIEwgMzcuNDEwMTU2IDM4LjgwODU5NCBDIDM2Ljk3MjY1NiAzOS4yMDMxMjUgNDQgMzQgNDQgMjQgQyA0NCAyMi42NjAxNTYgNDMuODYzMjgxIDIxLjM1MTU2MyA0My42MDkzNzUgMjAuMDgyMDMxIFogIj48L3BhdGg+PC9nPjwvc3ZnPg=='
                  />
                  Sign in with google
                </Button>
              )}
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
            />
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.user.auth,
    message: state.message,
  };
};

export default connect(mapStateToProps)(Login);
