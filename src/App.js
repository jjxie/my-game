import React, { Component } from "react";
import Header from "./components/header.jsx";
import Logo from "./components/logo.jsx";
import Score from "./components/score.jsx";
import Board from "./components/board.jsx";
import {
  initialGame,
  moveRight,
  moveLeft,
  moveUp,
  moveDown,
  newTile,
  checkGameOver,
  getZeroTileArray
} from "./function.js";
import ArrowKeysReact from "arrow-keys-react";

const gridX = 4;
const gridY = 4;
const tilesGameOver = [
  [4, 8, 2, 4],
  [2, 16, 4, 2],
  [4, 2, 8, 16],
  [256, 128, 4, 2]
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiles: Array.from(Array(gridX), () => Array(gridY).fill(0)),
      zeroTileArray: [],
      gameOver: false,
      score: 0,
      bestScore: 0
    };
  }

  componentDidMount() {
    let result = initialGame(gridX, gridY);
    this.setState({
      tiles: result.tiles,
      zeroTileArray: result.zeroArray,
      score: result.score
    });
  }

  handleMove = async (tiles, score, zeroTileArray) => {
    await this.setState({ tiles, score, zeroTileArray });
    if (this.state.zeroTileArray.length === 0) {
      let gameOver = checkGameOver(this.state.tiles);
      this.setState({ gameOver });
    } else {
      let tiles = await newTile(this.state.tiles, this.state.zeroTileArray);
      this.setState({ tiles });
    }
    let newZeroArray = await getZeroTileArray(this.state.tiles);
    this.setState({ zeroTileArray: newZeroArray });
  };

  handleRestart = () => {
    let result = initialGame(gridX, gridY);
    this.setState({
      tiles: result.tiles,
      zeroTileArray: result.zeroArray,
      score: result.score,
      gameOver: result.gameOver
    });
  };

  render() {
    ArrowKeysReact.config({
      left: async () => {
        let result = await moveLeft(this.state.tiles, this.state.score);
        this.handleMove(result.tiles, result.score, result.zeroArray);
      },
      right: async () => {
        let result = await moveRight(this.state.tiles, this.state.score);
        this.handleMove(result.tiles, result.score, result.zeroArray);
      },
      up: async () => {
        let result = await moveUp(this.state.tiles, this.state.score);
        this.handleMove(result.tiles, result.score, result.zeroArray);
      },
      down: async () => {
        let result = await moveDown(this.state.tiles, this.state.score);
        this.handleMove(result.tiles, result.score, result.zeroArray);
      }
    });

    return (
      <div {...ArrowKeysReact.events} tabIndex="1">
        <Header bestScore={this.state.bestScore} restart={this.handleRestart} />
        <Logo />
        <Score score={this.state.score} />
        <Board
          gridX={gridX}
          gridY={gridY}
          tiles={this.state.tiles}
          gameOver={this.state.gameOver}
        />
      </div>
    );
  }
}

export default App;
