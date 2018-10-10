import React from 'react';
import './Register.css';
import validator from 'validator';
import { Redirect, Link } from 'react-router-dom';
import { TextField, Button, Radio } from '@material-ui/core';

import { postSignupData } from '../../controllers/signupController';

const regEx = '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorEmail: false,
      errorPassword: false,
      errorConfirmPassword: false,
      errorName: false,
      errorNameText: 'Name should be atleast three characters long.',
      errorEmailText: 'Email should be valid',
      errorPasswordText: 'Password should be 6 characters long and should include atleast one uppercase letter or numeric character.',
      errorConfirmPasswordText: 'Both passwords should match.',
      redirect: false,
      typePerson: 'farmer'
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  handleNameChange(e) {
    const temp = e.target.value;
    this.setState(() => ({ name: temp, errorName: false }));
  }
  handleEmailChange(e) {
    const temp = e.target.value;
    this.setState(() => ({ email: temp, errorEmail: false }));
  }
  handlePasswordChange(e) {
    const temp = e.target.value;
    this.setState(() => ({ password: temp, errorPassword: false }));
  }
  handleConfirmPasswordChange(e) {
    const temp = e.target.value;
    this.setState(() => ({ confirmPassword: temp, errorConfirmPassword: false }));
  }

  handleSubmit(e) {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.pass0.value;
    const confirmPassword = e.target.elements.pass1.value;
    if (name.length < 3) {
      this.setState(() => ({ errorName: true }));
    } else if (!validator.isEmail(email)) {
      this.setState(() => ({ errorEmail: true }));
    } else if (!validator.matches(password, regEx)) {
      this.setState(() => ({ errorPassword: true }));
    } else if (password !== confirmPassword) {
      this.setState(() => ({ errorConfirmPassword: true }));
    } else {
      postSignupData({ username: name, email, password, confirmPassword }).then(res => {
        if (res.errorName) {
          this.setState(() => ({ errorName: true, errorNameText: res.errorMessage }));
        } else if (res.errorEmail) {
          this.setState(() => ({ errorEmail: true, errorEmailText: res.errorMessage }));
        } else if (res.errorConfirmPassword) {
          this.setState(() => ({ errorPassword: true, errorPasswordText: res.errorMessage }));
        } else if (res.errorPassword) {
          this.setState(() => ({ errorPassword: true, errorConfirmPasswordText: res.errorMessage }));
        } else if (res.errorEmail) {
          this.setState(() => ({ errorEmail: true, errorEmailText: res.errorMessage }));
        } else if (res.successMessage) {
          this.setState(() => ({ redirect: true }));
        }
      });
    }
  }

  handleTypeChange(e) {
    if (e.target.value === 'customer') {
      this.setState(() => ({ typePerson: 'customer' }));
    } else {
      this.setState(() => ({ typePerson: 'farmer' }));
    }
  }

  render() {
    return (
      this.state.redirect ?
        (
          <Redirect to='/user/login' />
        ) :
        (
          <div className='register-form'>
            <form method='POST' onSubmit={this.handleSubmit}>

              <div className='name-field'>
                <TextField
                  id="name"
                  label="Name"
                  margin="normal"
                  name='username'
                  onChange={this.handleNameChange}
                  value={this.state.name}
                  error={this.state.errorName}
                  helperText={this.state.errorName ? this.state.errorNameText : null}
                  fullWidth
                />
              </div>

              <div className='email-field'>
                <TextField
                  id="email"
                  label="Email"
                  margin="normal"
                  name='email'
                  onChange={this.handleEmailChange}
                  value={this.state.email}
                  error={this.state.errorEmail}
                  helperText={this.state.errorEmail ? this.state.errorEmailText : null}
                  fullWidth
                />
              </div>

              <div className='password-field-1'>
                <TextField
                  id="password-input-1"
                  label="Password"
                  type="password"
                  margin="normal"
                  name='pass0'
                  onChange={this.handlePasswordChange}
                  value={this.state.password}
                  error={this.state.errorPassword}
                  helperText={this.state.errorPassword ? this.state.errorPasswordText : null}
                  fullWidth
                />
              </div>

              <div className='password-field-2'>
                <TextField
                  id="password-input-2"
                  label="Confirm Password"
                  type="password"
                  margin="normal"
                  name='pass1'
                  onChange={this.handleConfirmPasswordChange}
                  value={this.state.confirmPassword}
                  error={this.state.errorConfirmPassword}
                  helperText={this.state.errorConfirmPassword ? this.state.errorConfirmPasswordText : false}
                  fullWidth
                />
              </div>

              <div>
                <Radio
                  checked={this.state.typePerson === 'farmer'}
                  onChange={this.handleTypeChange}
                  value="farmer"
                  name="radio-button-demo"
                  aria-label="A"
                /> Farmer
                <Radio
                  checked={this.state.typePerson === 'customer'}
                  onChange={this.handleTypeChange}
                  value="customer"
                  name="radio-button-demo"
                  aria-label="A"
                /> Customer
              </div>

              <div className='register-new-user'>
                <Button size="small" variant='outlined' fullWidth type='submit'>
                  Sign up
                </Button>
              </div>

              <div className='register-form-login-button'>
                <Link to='/user/login'>
                  <Button size="small" variant='outlined' fullWidth>
                    Log In
                  </Button>
                </Link>
              </div>

              <div className='third-party-login'>
                <a href='/auth/google'>
                  <Button size="small" variant='outlined' fullWidth>
                    <img alt='google logo' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IgogICAgIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIKICAgICB2aWV3Qm94PSIwIDAgNDggNDgiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDsiPjxnIGlkPSJzdXJmYWNlMSI+PHBhdGggc3R5bGU9IiBmaWxsOiNGRkMxMDc7IiBkPSJNIDQzLjYwOTM3NSAyMC4wODIwMzEgTCA0MiAyMC4wODIwMzEgTCA0MiAyMCBMIDI0IDIwIEwgMjQgMjggTCAzNS4zMDQ2ODggMjggQyAzMy42NTIzNDQgMzIuNjU2MjUgMjkuMjIyNjU2IDM2IDI0IDM2IEMgMTcuMzcxMDk0IDM2IDEyIDMwLjYyODkwNiAxMiAyNCBDIDEyIDE3LjM3MTA5NCAxNy4zNzEwOTQgMTIgMjQgMTIgQyAyNy4wNTg1OTQgMTIgMjkuODQzNzUgMTMuMTUyMzQ0IDMxLjk2MDkzOCAxNS4wMzkwNjMgTCAzNy42MTcxODggOS4zODI4MTMgQyAzNC4wNDY4NzUgNi4wNTQ2ODggMjkuMjY5NTMxIDQgMjQgNCBDIDEyLjk1MzEyNSA0IDQgMTIuOTUzMTI1IDQgMjQgQyA0IDM1LjA0Njg3NSAxMi45NTMxMjUgNDQgMjQgNDQgQyAzNS4wNDY4NzUgNDQgNDQgMzUuMDQ2ODc1IDQ0IDI0IEMgNDQgMjIuNjYwMTU2IDQzLjg2MzI4MSAyMS4zNTE1NjMgNDMuNjA5Mzc1IDIwLjA4MjAzMSBaICI+PC9wYXRoPjxwYXRoIHN0eWxlPSIgZmlsbDojRkYzRDAwOyIgZD0iTSA2LjMwNDY4OCAxNC42OTE0MDYgTCAxMi44Nzg5MDYgMTkuNTExNzE5IEMgMTQuNjU2MjUgMTUuMTA5Mzc1IDE4Ljk2MDkzOCAxMiAyNCAxMiBDIDI3LjA1ODU5NCAxMiAyOS44NDM3NSAxMy4xNTIzNDQgMzEuOTYwOTM4IDE1LjAzOTA2MyBMIDM3LjYxNzE4OCA5LjM4MjgxMyBDIDM0LjA0Njg3NSA2LjA1NDY4OCAyOS4yNjk1MzEgNCAyNCA0IEMgMTYuMzE2NDA2IDQgOS42NTYyNSA4LjMzNTkzOCA2LjMwNDY4OCAxNC42OTE0MDYgWiAiPjwvcGF0aD48cGF0aCBzdHlsZT0iIGZpbGw6IzRDQUY1MDsiIGQ9Ik0gMjQgNDQgQyAyOS4xNjQwNjMgNDQgMzMuODU5Mzc1IDQyLjAyMzQzOCAzNy40MTAxNTYgMzguODA4NTk0IEwgMzEuMjE4NzUgMzMuNTcwMzEzIEMgMjkuMjEwOTM4IDM1LjA4OTg0NCAyNi43MTQ4NDQgMzYgMjQgMzYgQyAxOC43OTY4NzUgMzYgMTQuMzgyODEzIDMyLjY4MzU5NCAxMi43MTg3NSAyOC4wNTQ2ODggTCA2LjE5NTMxMyAzMy4wNzgxMjUgQyA5LjUwMzkwNiAzOS41NTQ2ODggMTYuMjI2NTYzIDQ0IDI0IDQ0IFogIj48L3BhdGg+PHBhdGggc3R5bGU9IiBmaWxsOiMxOTc2RDI7IiBkPSJNIDQzLjYwOTM3NSAyMC4wODIwMzEgTCA0MiAyMC4wODIwMzEgTCA0MiAyMCBMIDI0IDIwIEwgMjQgMjggTCAzNS4zMDQ2ODggMjggQyAzNC41MTE3MTkgMzAuMjM4MjgxIDMzLjA3MDMxMyAzMi4xNjQwNjMgMzEuMjE0ODQ0IDMzLjU3MDMxMyBDIDMxLjIxODc1IDMzLjU3MDMxMyAzMS4yMTg3NSAzMy41NzAzMTMgMzEuMjE4NzUgMzMuNTcwMzEzIEwgMzcuNDEwMTU2IDM4LjgwODU5NCBDIDM2Ljk3MjY1NiAzOS4yMDMxMjUgNDQgMzQgNDQgMjQgQyA0NCAyMi42NjAxNTYgNDMuODYzMjgxIDIxLjM1MTU2MyA0My42MDkzNzUgMjAuMDgyMDMxIFogIj48L3BhdGg+PC9nPjwvc3ZnPg==" />
                    Google Sign up
                  </Button>
                </a>
              </div>

            </form>
          </div>
        )
    );
  }
}

export default Register;