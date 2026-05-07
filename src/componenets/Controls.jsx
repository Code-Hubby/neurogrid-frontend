function Controls({ algo, setAlgo, runAI }) {
  return (
    <div>
      <select onChange={(e) => setAlgo(e.target.value)} value={algo}>
        <option value="bfs">BFS</option>
        <option value="dfs">DFS</option>
        <option value="astar">A*</option>
      </select>

      <button onClick={runAI}>Run AI</button>
    </div>
  );
}

export default Controls;