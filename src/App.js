import { useState } from "react";
import Grid from "./components/Grid";
import Controls from "./components/Controls";
import { solvePath } from "./services/api";
import "./App.css";

function App() {
  const size = 10;

  const createGrid = () =>
    Array.from({ length: size }, () =>
      Array.from({ length: size }, () => 0)
    );

  const [grid, setGrid] = useState(createGrid());
  const [path, setPath] = useState([]);
  const [algo, setAlgo] = useState("bfs");
  const [currentStep, setCurrentStep] = useState(0);

  const toggleCell = (i, j) => {
    const newGrid = grid.map((row, r) =>
      row.map((cell, c) =>
        r === i && c === j ? (cell ? 0 : 1) : cell
      )
    );
    setGrid(newGrid);
  };

  const runAI = async () => {
    const data = await solvePath(grid, [0, 0], [9, 9], algo);

    setPath(data.path);
    setCurrentStep(0);

    animatePath(data.path);
  };

  const animatePath = (pathData) => {
    let i = 0;

    const interval = setInterval(() => {
      i++;

      setCurrentStep(i);

      if (i >= pathData.length - 1) {
        clearInterval(interval);
      }
    }, 200);
  };

  const getActiveCell = (i, j) => {
    if (path.length === 0) return false;

    const step = path[currentStep];
    return step && step[0] === i && step[1] === j;
  };

  return (
    <div className="App">
      <h1>NeuroGrid 🎮 AI Animation Mode</h1>

      <Controls algo={algo} setAlgo={setAlgo} runAI={runAI} />

      <Grid
        grid={grid}
        path={path}
        onToggle={toggleCell}
        activeCheck={getActiveCell}
      />
    </div>
  );
}

export default App;