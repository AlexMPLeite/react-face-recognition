import React from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.js";
import "./App.css";

const particlesOptions = {
  fps_limit: 28,
  particles: {
    number: {
      value: 250,
      density: {
        enable: false
      }
    },
    line_linked: {
      enable: true,
      distance: 100,
      opacity: 0.4
    },
    move: {
      speed: 1
    },
    opacity: {
      anim: {
        enable: true,
        opacity_min: 0.05,
        speed: 2,
        sync: false
      },
      value: 0.4
    }
  },
  retina_detect: false,
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "bubble"
      }
    },
    modes: {
      bubble: {
        size: 6,
        distance: 40
      }
    }
  }
};

const app = new Clarifai.App({
  apiKey: "c00e52104255458db7d068adf2081c60"
});
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      imgUrl: "",
      box: {}
    };
  }

  calculateFaceLocation = data => {
    console.log(data);
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.querySelector("#inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    this.setState({ box: box });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imgUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imgUrl} />
      </div>
    );
  }
}

export default App;
