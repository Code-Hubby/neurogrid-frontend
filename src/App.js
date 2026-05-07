import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const size = 10;

  const createGrid = () => {
    let grid = [];
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push(0);
      }
      grid.push(row);
    }
    return grid;
  };

  const [grid, setGrid] = useState(createGrid());
  const [path, setPath] = useState([]);
  const [gameStatus, setGameStatus] = useState("Playing");

  const player = [0, 0];
  const enemy = [9, 9];
  const goal = [0, 9];

  const toggleCell = (i, j) => {
    let newGrid = [...grid];
    newGrid[i][j] = newGrid[i][j] === 0 ? 1 : 0;
    setGrid(newGrid);
  };

  const runAI = async () => {
    setGameStatus("Running AI...");

    const res = await axios.post("http://127.0.0.1:8000/solve", {
      grid: grid,
      start: enemy,
      end: goal,
      algo: "astar"
    });

    setPath(res.data.path);

    // Check win condition
    if (res.data.path.length > 0) {
      setGameStatus("Enemy Reached Goal 💀");
    } else {
      setGameStatus("Player Survived 🎉");
    }
  };

  const isPath = (i, j) => {
    return path.find(p => p[0] === i && p[1] === j);
  };

  const isPlayer = (i, j) => i === player[0] && j === player[1];
  const isEnemy = (i, j) => i === enemy[0] && j === enemy[1];
  const isGoal = (i, j) => i === goal[0] && j === goal[1];

  return (
    <div className="App">
      <h1>NeuroGrid 🎮 Final Game Mode</h1>

      <h3>Status: {gameStatus}</h3>

      <button onClick={runAI}>Run Enemy AI</button>

      <div className="grid">
        {grid.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div
                key={j}
                onClick={() => toggleCell(i, j)}
                className="cell"
                style={{
                  backgroundColor: isPlayer(i, j)
                    ? "lime"
                    : isEnemy(i, j)
                    ? "red"
                    : isGoal(i, j)
                    ? "gold"
                    : isPath(i, j)
                    ? "#00ffff"
                    : cell === 1
                    ? "black"
                    : "transparent"
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;