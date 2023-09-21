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


  performFacialRecognition = async () => {
    const PAT = process.env.REACT_APP_PAT;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = this.state.input;
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": IMAGE_URL
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: raw
    };
    return await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions);
  };

  onButtonSubmit = () => {
    if (this.state.input.length > 0) {
      this.setState({ imageUrl: this.state.input, boxes: [] });

      this.performFacialRecognition()
        .then((response) => {
          if (response.ok) return response.json();
          else throw Error('Enter a valid image URL!');
        })
        .then((response) => {
          if (response) {
            fetch('https://brainer-api.vercel.app/image', {
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
