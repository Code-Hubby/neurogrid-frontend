/**
 * NeuroGrid - App.js
 * Global state management, animation loop, API orchestration.
 */
import React, { useState, useRef, useCallback } from "react";
import Grid from "./components/Grid";
import Controls from "./components/Controls";
import { solveGrid } from "./services/api";
import "./App.css";

const ROWS = 10;
const COLS = 10;
const START = [0, 0];
const END   = [9, 9];

const SPEED_MS = { 1: 180, 2: 90, 3: 35 };

function makeEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export default function App() {
  const [grid,        setGrid]        = useState(makeEmptyGrid);
  const [algo,        setAlgo]        = useState("astar");
  const [path,        setPath]        = useState([]);
  const [activeStep,  setActiveStep]  = useState(-1);
  const [isRunning,   setIsRunning]   = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed,       setSpeed]       = useState(2);
  const [status,      setStatus]      = useState({ type: "idle", message: "" });

  const animRef = useRef(null);

  /* ─── Toggle wall ──────────────────────────────────────── */
  const handleCellClick = useCallback((row, col) => {
    // Protect start and end
    if ((row === START[0] && col === START[1]) ||
        (row === END[0]   && col === END[1]))  return;
    if (isAnimating || isRunning) return;

    setGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = next[row][col] === 1 ? 0 : 1;
      return next;
    });
    // Clear stale path when the grid changes
    setPath([]);
    setActiveStep(-1);
    setStatus({ type: "idle", message: "" });
  }, [isAnimating, isRunning]);

  /* ─── Run AI ───────────────────────────────────────────── */
  const handleRun = useCallback(async () => {
    if (isRunning || isAnimating) return;

    setPath([]);
    setActiveStep(-1);
    setIsRunning(true);
    setStatus({ type: "loading", message: `Running ${algo.toUpperCase()} pathfinder…` });

    try {
      const result = await solveGrid(grid, START, END, algo);

      if (!result.found || result.path.length === 0) {
        setStatus({ type: "error", message: "No path found. Try removing some walls." });
        setIsRunning(false);
        return;
      }

      setPath(result.path);
      setStatus({
        type: "animate",
        message: `Path found! Animating ${result.length} steps…`,
      });
      setIsRunning(false);
      runAnimation(result.path);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Backend unreachable.";
      setStatus({ type: "error", message: `Error: ${msg}` });
      setIsRunning(false);
    }
  }, [grid, algo, isRunning, isAnimating, speed]);

  /* ─── Animation loop ───────────────────────────────────── */
  function runAnimation(resolvedPath) {
    setIsAnimating(true);
    let step = 0;

    function tick() {
      if (step >= resolvedPath.length) {
        setIsAnimating(false);
        setActiveStep(-1);
        setStatus({
          type: "success",
          message: `Navigation complete in ${resolvedPath.length} steps.`,
        });
        return;
      }
      setActiveStep(step);
      step++;
      animRef.current = setTimeout(tick, SPEED_MS[speed] || 90);
    }

    tick();
  }

  /* ─── Reset ─────────────────────────────────────────────── */
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
      {/* Background scanline effect */}
      <div className="app__scanlines" aria-hidden="true" />

      {/* Header */}
      <header className="app__header">
        <div className="app__logo">
          <span className="app__logo-icon">◈</span>
          <span className="app__logo-text">NEURO<span>GRID</span></span>
        </div>
        <p className="app__tagline">AI PATHFINDING ENGINE · REAL-TIME VISUALIZATION</p>
      </header>

      {/* Main layout */}
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

      {/* Footer */}
      <footer className="app__footer">
        <span>NeuroGrid · React + FastAPI · BFS · DFS · A*</span>
      </footer>
    </div>
  );
}
