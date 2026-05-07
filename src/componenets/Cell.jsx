function Cell({ value, onClick, isPath }) {
  return (
    <div
      onClick={onClick}
      className="cell"
      style={{
        backgroundColor: isPath
          ? "#00ffff"
          : value
          ? "red"
          : "transparent",
      }}
    />
  );
}

export default Cell;