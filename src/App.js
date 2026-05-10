import React, { useState, useRef, useCallback } from "react";
import Grid from "./components/Grid";
import Controls from "./components/Controls";
import { solvePath } from "./services/api";
import "./App.css";

const ROWS = 10;
const COLS = 10;
const START = [0, 0];
const END = [9, 9];

const SPEED_MS = { 1: 180, 2: 90, 3: 35 };

function makeEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export default function App() {
  const [grid, setGrid] = useState(makeEmptyGrid());
  const [algo, setAlgo] = useState("astar");
  const [path, setPath] = useState([]);
  const [activeStep, setActiveStep] = useState(-1);

  const [isRunning, setIsRunning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [speed, setSpeed] = useState(2);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const animRef = useRef(null);

  // ───── ANIMATION (FIXED: NO DEPENDENCY ISSUE) ─────
  const runAnimation = useCallback(
    (resolvedPath) => {
      setIsAnimating(true);
      let step = 0;

      function tick() {
        if (step >= resolvedPath.length) {
          setIsAnimating(false);
          setActiveStep(-1);

          setStatus({
            type: "success",
            message: `Completed in ${resolvedPath.length} steps`,
          });

          return;
        }

        setActiveStep(step);
        step++;

        animRef.current = setTimeout(tick, SPEED_MS[speed] || 90);
      }

      tick();
    },
    [speed]
  );

  // ───── Toggle Wall ─────
  const handleCellClick = useCallback(
    (row, col) => {
      if (
        (row === START[0] && col === START[1]) ||
        (row === END[0] && col === END[1])
      )
        return;

      if (isAnimating || isRunning) return;

      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = next[row][col] === 1 ? 0 : 1;
        return next;
      });

      setPath([]);
      setActiveStep(-1);
      setStatus({ type: "idle", message: "" });
    },
    [isAnimating, isRunning]
  );

  // ───── RUN AI ─────
  const handleRun = useCallback(async () => {
    if (isRunning || isAnimating) return;

    setIsRunning(true);

    try {
      const result = await solvePath({
        grid,
        start: START,
        end: END,
        algo,
      });

      if (!result.found) {
        setStatus({
          type: "error",
          message: "No path found. Try removing walls.",
        });
        setIsRunning(false);
        return;
      }

      setPath(result.path);

      setIsRunning(false);
      runAnimation(result.path);
    } catch (err) {
      setIsRunning(false);
      setStatus({
        type: "error",
        message: err.message || "Backend error",
      });
    }
  }, [grid, algo, isRunning, isAnimating, runAnimation]);

  // ───── RESET ─────
  const handleReset = useCallback(() => {
    if (animRef.current) clearTimeout(animRef.current);

    setGrid(makeEmptyGrid());
    setPath([]);
    setActiveStep(-1);
    setIsRunning(false);
    setIsAnimating(false);

    setStatus({ type: "idle", message: "" });
  }, []);

  return (
    <div className="app">
      <div className="app__scanlines" />

      <header className="app__header">
        <div className="app__logo">
          ◈ NEURO<span>GRID</span>
        </div>
        <p>AI PATHFINDING ENGINE</p>
      </header>

      <main className="app__main">
        <Grid
          grid={grid}
          path={path}
          activeStep={activeStep}
          onCellClick={handleCellClick}
          start={START}
          end={END}
        />

        <Controls
          algo={algo}
          onAlgoChange={setAlgo}
          onRun={handleRun}
          onReset={handleReset}
          onSpeedChange={setSpeed}
          speed={speed}
          isRunning={isRunning}
          isAnimating={isAnimating}
          pathLength={path.length}
          status={status}
        />
      </main>
    </div>
  );
}