import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Logo from './Components/Logo/Logo';
import Signin from './Components/SignIn/Signin';
import Register from './Components/Register/register';
import './App.css';
import Particles from 'react-particles-js';
import particless from './Components/Logo/particlesjs-config.json';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: '',
  },
  error: '',
};
class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return data.outputs[0].data.regions.map((face) => {
      const clarifaiFace = face.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    });
  };

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
  };

  OnInputChange = (event) => {
    this.setState({ input: event.target.value });
  };
  enter = (event) => {
    if (event.key === 'Enter') {
      this.onButtonSubmit();
    }
  };

  onButtonSubmit = () => {
    if (this.state.input.length > 0) {
      this.setState({ imageUrl: this.state.input });
      fetch('https://thawing-sierra-39693.herokuapp.com/imageurl', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: this.state.input,
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
          else throw Error('Enter a valid image URL!');
        })
        .then((response) => {
          if (response) {
            fetch('https://thawing-sierra-39693.herokuapp.com/image', {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id,
              }),
            })
              .then((response) => {
                if (response.ok) return response.json();
                else throw Error('Unable to get response!');
              })
              .then((count) => {
                this.setState(
                  Object.assign(this.state.user, { entries: count })
                );
              });
          }
          this.displayFaceBox(this.calculateFaceLocation(response));
        })
        .catch((err) => {
          this.setState({ error: err.message });
          console.log(err);
        });
    } else {
      this.setState({ error: 'Enter something!' });
    }
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    let { isSignedIn, imageUrl, route, boxes, error } = this.state;
    return (
      <div className='App'>
        <Particles className='particles' params={particless} />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {route === 'home' ? (
          <div>
            <div className='rowC'>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
            </div>

            <ImageLinkForm
              OnInputChange={this.OnInputChange}
              onButtonSubmit={this.onButtonSubmit}
              enter={this.enter}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            <br />
            {error && <i className='fa fa-warning f4 red'> {error}</i>}
          </div>
        ) : route === 'signin' ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
