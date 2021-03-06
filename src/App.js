import React, { Component } from 'react';
import Snake from './Snake';
import Food from './Food';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y =  Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}

const initialState = {
  food: getRandomCoordinates(),
  speed: 150,
  direction: 'RIGHT',
  score: 0,
  snakeDots: [
    [0,0],
    [2,0]
  ]
}

class App extends Component {

  constructor(props) {
    super();
    this.state = initialState;
  }

  speed() {
    clearInterval(this.interval);
    this.interval = setInterval(this.moveSnake, this.state.speed);
  }

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
    this.speed();
  }

  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        if (this.state.direction !== "DOWN")
          this.setState({direction: 'UP'});
        break;
      case 40:
        if (this.state.direction !== "UP")
          this.setState({direction: 'DOWN'});
        break;
      case 37:
        if (this.state.direction !== "RIGHT")
          this.setState({direction: 'LEFT'});
        break;
      case 39:
        if (this.state.direction !== "LEFT")
          this.setState({direction: 'RIGHT'});
        break;
      case 16:
          this.setState({speed:50});
        break;
      case 17:
          this.setState({speed:(200-(this.state.snakeDots.length*5))});
        break;
      default:
        break;
    }
  };

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
      default:
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    })
  }

  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        this.onGameOver();
      }
    })
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      this.setState({
        food: getRandomCoordinates()
      })
      this.enlargeSnake();
      this.increaseSpeed();
      this.updateScore();
    }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    })
  }

  increaseSpeed() {
    if (this.state.speed > 50) {
      this.setState({
        speed: this.state.speed - 5
      })
    }
  }

  updateScore(){
    this.setState({
      score: this.state.score + 10
    })
  }

  showScore(){
    document.getElementById('score').innerText = this.state.score;
    document.getElementById('length').innerText = this.state.snakeDots.length;
  }

  onGameOver() {
    alert(`\nGame Over!\n\nYour Score is ${this.state.score}.\n\nSnake length is ${this.state.snakeDots.length}.`);
    this.setState(initialState)
  }

  render() {
    setTimeout(() =>{
      this.showScore();
    },1000);

    return (
      <body>
        <div className="Heading">How many semicolons can your python 'catch' ?</div>
          <div className="game-area">
            <Snake snakeDots={this.state.snakeDots}/>
            <Food dot={this.state.food}/>
          </div>
        <div className="Hint">Hint: Top portion of a semicolon is the delicious part</div>
        <div id="score_container">
          <p>Score : <span id="score"> 0</span></p>
          <p>Length : <span id="length"> 2</span></p>
        </div>
        <div className="Instn">
          <p>Instructions:</p>
          <ul>
            <li>Use arrow keys to move</li>
            <li>Press Shift to activate HyperSnake</li>
            <li>Press Ctrl to clam the snake down</li>
            <li>Hold arrow keys for slow motion</li>
          </ul>
        
        </div>
      </body>
    );
  }
}

export default App;
