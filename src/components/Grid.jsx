/**
 * NeuroGrid - Grid Component
 * Renders the 10x10 interactive game grid.
 * Delegates cell-level rendering to <Cell />.
 */
import React from "react";
import Cell from "./Cell";
import "./Grid.css";

const ROWS = 10;
const COLS = 10;

export default function Grid({
  grid,
  path,
  activeStep,
  onCellClick,
  start,
  end,
}) {
  // Build fast lookup sets for O(1) queries
  const pathSet = new Set(path.map(([r, c]) => `${r},${c}`));

  // The "active" cell is the AI's current position during animation
  const activeCell =
    activeStep >= 0 && activeStep < path.length
      ? `${path[activeStep][0]},${path[activeStep][1]}`
      : null;

  // Cells painted so far (up to activeStep)
  const paintedPath = new Set(
    path.slice(0, activeStep).map(([r, c]) => `${r},${c}`)
  );

  return (
    <div className="grid-wrapper">
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const key = `${row},${col}`;
            const isStart   = row === start[0] && col === start[1];
            const isEnd     = row === end[0]   && col === end[1];
            const isWall    = grid[row][col] === 1;
            const isPath    = pathSet.has(key) && paintedPath.has(key) && !isStart && !isEnd;
            const isActive  = activeCell === key && !isStart && !isEnd;

            return (
              <Cell
                key={key}
                row={row}
                col={col}
                isWall={isWall}
                isPath={isPath}
                isActive={isActive}
                isStart={isStart}
                isEnd={isEnd}
                onClick={onCellClick}
              />
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="grid-legend">
        <span className="legend-item legend-start">Start</span>
        <span className="legend-item legend-end">End</span>
        <span className="legend-item legend-path">Path</span>
        <span className="legend-item legend-wall">Wall</span>
        <span className="legend-item legend-active">Agent</span>
      </div>
    </div>
  );
}
