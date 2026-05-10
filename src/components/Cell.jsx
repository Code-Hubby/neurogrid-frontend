/**
 * NeuroGrid - Cell Component
 * Renders a single grid cell with all visual states.
 *
 * States (checked in priority order):
 *   isStart   → blue glowing origin
 *   isEnd     → green glowing target
 *   isActive  → amber pulse (AI currently here)
 *   isPath    → cyan trail
 *   isWall    → dark blocked obstacle
 *   default   → neutral open cell
 */
import React, { memo } from "react";
import "./Cell.css";

const Cell = memo(function Cell({
  row,
  col,
  isWall,
  isPath,
  isActive,
  isStart,
  isEnd,
  onClick,
}) {
  const classNames = [
    "cell",
    isStart  ? "cell--start"  : "",
    isEnd    ? "cell--end"    : "",
    isActive ? "cell--active" : "",
    isPath   ? "cell--path"   : "",
    isWall   ? "cell--wall"   : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      onClick={() => onClick(row, col)}
      title={
        isStart  ? "Start" :
        isEnd    ? "End"   :
        isWall   ? "Wall"  : `(${row},${col})`
      }
      role="button"
      aria-label={`Cell ${row},${col}`}
    />
  );
});

export default Cell;
