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
  box: {},
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
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
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
        .then((response) => response.json())
        .then((response) => {
          if (response) {
            fetch('https://thawing-sierra-39693.herokuapp.com/image', {
              method: 'put',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id,
              }),
            })
              .then((response) => response.json())
              .then((count) => {
                this.setState(
                  Object.assign(this.state.user, { entries: count })
                );
              });
          }
          this.displayFaceBox(this.calculateFaceLocation(response));
        })
        .catch((err) => {
          alert('Some Error Occurred!');
          console.log(err);
        });
    } else {
      alert('Enter something!');
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
    let { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className='App'>
        <Particles className='particles' params={particless} />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              OnInputChange={this.OnInputChange}
              onButtonSubmit={this.onButtonSubmit}
              enter={this.enter}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
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
