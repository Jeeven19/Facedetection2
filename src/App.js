import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/logo/logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';


const app = new Clarifai.App({                             //api key Declaration 
 apiKey: '83e14ecbc06241489ae6f143e7589381'
});

const particlesOptions = {                                 //BackGround Particles 
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
  


class App extends Component {
  constructor() {
    super();
    this.state ={                                          //State Declaration
      input:'',
      imageUrl: '',
      box: {},
      route: 'Signin',
      isSignedIn: false,
      user: {
        id:'',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {                       //Function using api for face detection
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{ 
      leftcol: clarifaiFace.left_col * width, 
      topRow: clarifaiFace.top_row * height,
      rightcol: width -(clarifaiFace.right_col * width),
      bottomRow: height -(clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox =(box) =>{
    this.setState({box: box});
  }


  onInputchange = (event) =>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit=() => {
    this.setState({imageUrl: this.state.input}); 
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count =>{
            this.setState(Object.assign(this.state.user,{entries: count}))
          })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
     })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'Signout') {
      this.setState({isSignedIn: false})
    }else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }


  render(){
  return (
    <div className="App">
        <Particles   className='particles'
          params={particlesOptions} 
        />
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
      { this.state.route ==='home'
      ? <div>
          <Logo />
          <Rank />
          <ImageLinkForm 
            onInputchange={this.onInputchange} 
            onButtonSubmit={this.onButtonSubmit}
          />  
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
      : (
         this.state.route === 'Signin' 
         ? <Signin onRouteChange={this.onRouteChange}/>
         : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

        )     
      }    
    </div>
  );
}
}

export default App;







