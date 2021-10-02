import React, { Component } from 'react';
import SimpleReactValidator from 'simple-react-validator';

class register extends Component {
  constructor(props) {
    super(props);

    this.validator = new SimpleReactValidator({
      // element: (message, className) => <div className="invalid-feedback d-block">{message}</div>,
      // locale: 'fr',
      autoForceUpdate: this,
      className: 'text-danger',
      messages: {
        // email: 'That is not an email.',
        // default: "Womp! That's not right!"
      },
    });
  }
  state = {
    email: '',
    password: '',
    name: '',
    isPasswordShown: false,
    loading: false,
    errorMessage: '',
  };
  togglePasswordVisiblity = () => {
    const { isPasswordShown } = this.state;
    this.setState({ isPasswordShown: !isPasswordShown });
  };

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  onNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  onSubmitSignIn = () => {
    if (this.validator.allValid()) {
      this.setState({ loading: true });
      fetch('https://thawing-sierra-39693.herokuapp.com/register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          name: this.state.name,
        }),
      })
        .then((response) => {
          this.setState({ loading: false });
          if (response.ok) return response.json();
          else throw Error('Some Error occured!');
        })
        .then((user) => {
          if (user.id) {
            this.props.loadUser(user);
            this.props.onRouteChange('home');
          }
        })
        .catch((err) => {
          this.setState({
            errorMessage: err.message,
            loading: false,
          });
          console.log(this.state.errorMessage);
        });
    } else {
      this.validator.showMessages();
    }
  };

  render() {
    const { isPasswordShown, loading, errorMessage } = this.state;
    return (
      <article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
        <main className='pa4 black-80'>
          <div className='measure' method='POST'>
            <fieldset id='sign_up' className='ba b--transparent ph0 mh0'>
              <legend className='f2 b fw6 ph0 mh0'>Register</legend>
              <div className='mt3'>
                <label className='db fw6 lh-copy f6' htmlFor='name'>
                  Name
                </label>
                <input
                  className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                  type='text'
                  name='name'
                  id='name'
                  onChange={this.onNameChange}
                  onBlur={() => this.validator.showMessageFor('name')}
                />
                {this.validator.message(
                  'name',
                  this.state.name,
                  'required|alpha_space',
                  { className: 'text-danger washed-yellow pv1' }
                )}
              </div>
              <div className='mt3'>
                <label className='db fw6 lh-copy f6' htmlFor='email-address'>
                  Email
                </label>
                <input
                  className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                  type='email'
                  name='email-address'
                  id='email-address'
                  onChange={this.onEmailChange}
                  onBlur={() => this.validator.showMessageFor('email')}
                />
                {this.validator.message(
                  'email',
                  this.state.email,
                  'required|email',
                  { className: 'text-danger washed-yellow pv1' }
                )}
              </div>
              <div className='mv3'>
                <label className='db fw6 lh-copy f6' htmlFor='password'>
                  Password
                </label>

                <input
                  className='b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                  type={isPasswordShown ? 'text' : 'password'}
                  name='password'
                  id='password'
                  onChange={this.onPasswordChange}
                  onBlur={() => this.validator.showMessageFor('password')}
                />
                <i
                  className={
                    !isPasswordShown
                      ? 'fa fa-eye password-icon'
                      : 'fa fa-eye-slash password-icon'
                  }
                  onClick={this.togglePasswordVisiblity}
                />

                {this.validator.message(
                  'password',
                  this.state.password,
                  'required|min:8',
                  { className: 'text-danger washed-yellow pv1' }
                )}
              </div>
            </fieldset>

            <div className=''>
              <button
                className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib'
                onClick={this.onSubmitSignIn}
                type='submit'
              >
                {loading && <i className='fa fa-refresh fa-spin'></i>}

                {errorMessage ? errorMessage : !loading ? 'Register' : ''}
              </button>
            </div>
          </div>
        </main>
      </article>
    );
  }
}
export default register;
