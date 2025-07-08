import React, { useState } from 'react';
import './App.css';
import chickenImg from './assets/chicken.jpg';
import bananaImg from './assets/banana.jpg';

const CHICKEN_IMG = chickenImg;
const BANANA_IMG = bananaImg;

function getShuffledTiles() {
  const tiles = [
    ...Array(18).fill({ type: 'chicken', img: CHICKEN_IMG }),
    ...Array(18).fill({ type: 'banana', img: BANANA_IMG }),
  ];
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

function App() {
  const [tiles, setTiles] = useState(getShuffledTiles());
  const [revealed, setRevealed] = useState(Array(36).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [scores, setScores] = useState({ chicken: 0, banana: 0 });
  const [playerSide, setPlayerSide] = useState(null);

  const remaining = (type) =>
    tiles.filter((tile, i) => tile.type === type && !revealed[i]).length;

  const handleTileClick = (idx) => {
    if (gameOver || revealed[idx] || !playerSide) return;

    const tile = tiles[idx];
    const updatedRevealed = [...revealed];
    updatedRevealed[idx] = true;
    setRevealed(updatedRevealed);

    if (tile.type !== playerSide) {
      setGameOver(true);
      const otherSide = playerSide === 'chicken' ? 'Banana Player' : 'Chicken Player';
      setWinner(otherSide);
      setScores((prev) => ({
        ...prev,
        [playerSide === 'chicken' ? 'banana' : 'chicken']: prev[playerSide === 'chicken' ? 'banana' : 'chicken'] + 1,
      }));
      return;
    }

    if (remaining(playerSide) - 1 === 0) {
      setGameOver(true);
      setWinner(playerSide === 'chicken' ? 'Chicken Player' : 'Banana Player');
      setScores((prev) => ({
        ...prev,
        [playerSide]: prev[playerSide] + 1,
      }));
    }
  };

  const handleRestart = () => {
    setTiles(getShuffledTiles());
    setRevealed(Array(36).fill(false));
    setGameOver(false);
    setWinner('');
    setPlayerSide(null);
  };

  const handleRevealAll = () => {
    setRevealed(Array(36).fill(true));
  };

  const handleResetBoard = () => {
    setTiles(getShuffledTiles());
    setRevealed(Array(36).fill(false));
    setGameOver(false);
    setWinner('');
  };

  return (
    <div className="container">
      <h1>
        <span className="chicken-header">Chicken</span>{' '}
        <span className="and-header">vs</span>{' '}
        <span className="banana-header">Banana</span>
      </h1>

      <div className="scoreboard">
        <span className="score chicken">🐔 {scores.chicken}</span>
        <span className="score banana">🍌 {scores.banana}</span>
      </div>

      {!playerSide && (
        <div className="choose-side">
          <p>Choose your side:</p>
          <button className="side-btn chicken" onClick={() => setPlayerSide('chicken')}>Play as Chicken</button>
          <button className="side-btn banana" onClick={() => setPlayerSide('banana')}>Play as Banana</button>
        </div>
      )}

      <p className="status-text">
        {!playerSide
          ? 'Pick your side to start the game!'
          : gameOver
            ? <strong className="winner-text">{winner} wins!</strong>
            : 'Click your tiles! Clicking the wrong tile ends the game.'}
      </p>

      <div className="grid">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            className={`square ${revealed[idx] ? 'revealed' : ''}`}
            onClick={() => handleTileClick(idx)}
            disabled={gameOver || revealed[idx] || !playerSide}
          >
            {revealed[idx] ? (
              <img src={tile.img} alt={tile.type} />
            ) : (
              <span>{idx + 1}</span>
            )}
          </button>
        ))}
      </div>

      <button className="restart-btn" onClick={handleRestart}>
        Restart Game
      </button>

      <div className="control-buttons">
        <button className="reveal-btn" onClick={handleRevealAll}>
          Reveal All
        </button>
        <button className="reset-btn" onClick={handleResetBoard}>
          Reset Board
        </button>
      </div>
    </div>
  );
}

export default App;
