import Cell from "./Cell";

function Grid({ grid, path, onToggle, activeCheck }) {
  return (
    <div className="grid">
      {grid.map((row, i) => (
        <div key={i} className="row">
          {row.map((cell, j) => (
            <Cell
              key={j}
              value={cell}
              isPath={activeCheck(i, j)}
              onClick={() => onToggle(i, j)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;