/**
 * NeuroGrid - Controls Component
 * Algorithm selector, Run AI button, Reset, and speed control.
 */
import React from "react";
import "./Controls.css";

const ALGORITHMS = [
  {
    value: "astar",
    label: "A* — Smart",
    badge: "OPTIMAL",
    desc: "Heuristic-guided. Fastest & optimal.",
    color: "gold",
  },
  {
    value: "bfs",
    label: "BFS — Breadth-First",
    badge: "SHORTEST",
    desc: "Layer-by-layer. Guarantees shortest path.",
    color: "blue",
  },
  {
    value: "dfs",
    label: "DFS — Depth-First",
    badge: "DEEP DIVE",
    desc: "Stack-based. Explores one path fully first.",
    color: "purple",
  },
];

export default function Controls({
  algo,
  onAlgoChange,
  onRun,
  onReset,
  onSpeedChange,
  speed,
  isRunning,
  isAnimating,
  pathLength,
  status,
}) {
  const canRun = !isRunning && !isAnimating;

  return (
    <div className="controls">
      {/* Header */}
      <div className="controls__header">
        <span className="controls__dot controls__dot--live" />
        <span className="controls__title">AI CONTROL PANEL</span>
      </div>

      {/* Algorithm Selector */}
      <div className="controls__section">
        <label className="controls__label">ALGORITHM</label>
        <div className="algo-cards">
          {ALGORITHMS.map((a) => (
            <button
              key={a.value}
              className={`algo-card algo-card--${a.color} ${algo === a.value ? "algo-card--active" : ""}`}
              onClick={() => onAlgoChange(a.value)}
              disabled={isAnimating}
            >
              <div className="algo-card__top">
                <span className="algo-card__name">{a.label}</span>
                <span className="algo-card__badge">{a.badge}</span>
              </div>
              <span className="algo-card__desc">{a.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Speed Slider */}
      <div className="controls__section">
        <label className="controls__label">
          ANIMATION SPEED
          <span className="controls__label-value">
            {speed === 1 ? "SLOW" : speed === 2 ? "MEDIUM" : "FAST"}
          </span>
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={1}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="speed-slider"
          disabled={isAnimating}
        />
      </div>

      {/* Action Buttons */}
      <div className="controls__actions">
        <button
          className={`btn btn--run ${isRunning ? "btn--loading" : ""}`}
          onClick={onRun}
          disabled={!canRun}
        >
          {isRunning ? (
            <>
              <span className="btn__spinner" />
              SOLVING…
            </>
          ) : isAnimating ? (
            <>
              <span className="btn__dot" />
              NAVIGATING…
            </>
          ) : (
            <>
              <span className="btn__icon">▶</span>
              RUN AI
            </>
          )}
        </button>

        <button
          className="btn btn--reset"
          onClick={onReset}
          disabled={isRunning || isAnimating}
        >
          ↺ RESET
        </button>
      </div>

      {/* Status Panel */}
      <div className={`status-panel status-panel--${status.type || "idle"}`}>
        <div className="status-panel__indicator" />
        <div className="status-panel__content">
          <span className="status-panel__message">{status.message || "Click cells to place walls. Press RUN AI to solve."}</span>
          {pathLength > 0 && (
            <span className="status-panel__meta">Path length: {pathLength} steps</span>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="controls__hint">
        <p>Click any cell to toggle a wall obstacle.</p>
        <p>Start = top-left (0,0) · End = bottom-right (9,9)</p>
      </div>
    </div>
  );
}
