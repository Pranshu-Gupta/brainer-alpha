import React from 'react';
import SimpleReactValidator from 'simple-react-validator';
const { default: axios } = require('axios');

class Signin extends React.Component {
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
    signInEmail: '',
    signInPassword: '',
    isPasswordShown: false,
    errorMessage: '',
    loading: false,
  };

  togglePasswordVisiblity = () => {
    const { isPasswordShown } = this.state;
    this.setState({ isPasswordShown: !isPasswordShown });
  };
  onEmailChange = (event) => {
    this.setState({ signInEmail: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ signInPassword: event.target.value });
  };

  // onSubmitSignIn = () => {
  //   if (this.validator.allValid()) {
  //     this.setState({ loading: true });
  //     fetch('https://thawing-sierra-39693.herokuapp.com/signin', {
  //       method: 'post',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         email: this.state.signInEmail,
  //         password: this.state.signInPassword,
  //       }),
  //     })
  //       .then((response) => {
  //         this.setState({ loading: false });
  //         if (response.ok) return response.json();
  //         else throw Error('Invalid credentials');
  //       })

  //       .then((user) => {
  //         if (user.id) {
  //           this.props.loadUser(user);
  //           this.props.onRouteChange('home');
  //         }
  //       })
  //       .catch((err) => {
  //         this.setState({
  //           errorMessage: err.message,
  //         });
  //         console.log(this.state.errorMessage);
  //       });
  //   } else {
  //     this.validator.showMessages();
  //   }
  // };

  onSubmitSignIn = async () => {
    if (this.validator.allValid()) {
      try {
        this.setState({ loading: true });
        const response = await axios.post(
          'https://thawing-sierra-39693.herokuapp.com/signin',
          {
            email: this.state.signInEmail,
            password: this.state.signInPassword,
          }
        );
        const user = response.data;
        this.setState({ loading: false });
        if (user.id) {
          this.props.loadUser(user);
          this.props.onRouteChange('home');
        }
      } catch (error) {
        let errMes = '';
        if (error.response.status === 400) errMes = 'Invalid credentials!';
        else errMes = 'Error occurred while retrieving data!';
        this.setState({
          errorMessage: errMes,
        });
      }
    } else {
      this.validator.showMessages();
    }
  };

  render() {
    const { onRouteChange } = this.props;
    const { isPasswordShown, errorMessage, loading } = this.state;
    return (
      <article className='br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center'>
        <main className='pa4 black-80'>
          <div className='measure' method='POST'>
            <fieldset id='sign_up' className='ba b--transparent ph0 mh0'>
              <legend className='f2 b fw6 ph0 mh0'>Sign In</legend>
              <div className='mt3'>
                <label className='db fw6 lh-copy f6' htmlFor='email-address'>
                  Email
                </label>
                <input
                  className='pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100'
                  type='email'
                  name='email-address'
                  id='email-address'
                  required
                  onChange={this.onEmailChange}
                />
                {this.validator.message(
                  'email',
                  this.state.signInEmail,
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
                  required
                  onChange={this.onPasswordChange}
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
                  this.state.signInPassword,
                  'required',
                  { className: 'text-danger washed-yellow pv1' }
                )}
              </div>
              {errorMessage && <h4 className='red'> {errorMessage} </h4>}
            </fieldset>

            <div className=''>
              <button
                className='b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib'
                onClick={this.onSubmitSignIn}
                type='submit'
                // value={!loading ? 'Sign in' : 'Signing In'}
              >
                {loading && <i className='fa fa-refresh fa-spin'></i>}
                {!loading ? ' Sign in' : ' Signing In'}
              </button>
            </div>
            <div className='lh-copy mt3'>
              <p
                onClick={() => onRouteChange('register')}
                className='f6 b link dim white db pointer'
              >
                Register
              </p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}
export default Signin;
