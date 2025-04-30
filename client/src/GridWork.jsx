import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

const GridWork = ({
  algorithm,
  mode,
  running,
  setRunning,
  moveIndex,
  setMoveIndex,
  setStepInfo,
  stepInfo,
  setMovesLength
}) => {
  const [grid, setGrid] = useState([]);
  const [planePosition, setPlanePosition] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [moves, setMoves] = useState([]);
  const [scanArea, setScanArea] = useState([]);
  const [visitedCells, setVisitedCells] = useState([]);
  const [algorithmResult, setAlgorithmResult] = useState(null);

  useEffect(() => {
    const fetchGrid = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/get-map");
        const data = await response.json();
        setGrid(data.grid);
        const start = {
          row: data.start_position[0],
          col: data.start_position[1],
          direction: "E",
        };
        setPlanePosition(start);
        setStartPosition(start);
      } catch (err) {
        console.error("Grid fetch failed:", err);
      }
    };
    fetchGrid();
  }, []);

  useEffect(() => {
    if (mode === "Manual" || mode === "Automatic") {
      fetchMovesAndStart();
    }
  }, [mode, algorithm]);

  useEffect(() => {
    if (!running || mode !== "Automatic") return;
    let i = 0;
    const interval = setInterval(() => {
      if (i >= moves.length) {
        clearInterval(interval);
        setRunning(false);
        return;
      }
      const move = moves[i];
      setPlanePosition(move);
      setScanArea(getScanCells(move.row, move.col, move.direction));
      setVisitedCells(prev => [...new Set([...prev, `${move.row}-${move.col}`])]);
      i++;
    }, 120);
    return () => clearInterval(interval);
  }, [running, moves, mode]);

  useEffect(() => {
    if (mode !== "Manual" || moves.length === 0) return;
    const move = moves[moveIndex];
    setPlanePosition(move);
    const newScan = getScanCells(move.row, move.col, move.direction);
    setScanArea(newScan);
    setVisitedCells(prev => [...new Set([...prev, `${move.row}-${move.col}`])]);
    setStepInfo({
      index: moveIndex + 1,
      total: moves.length,
      row: move.row,
      col: move.col,
      direction: move.direction,
      scannedCount: newScan.length,
    });
  }, [moveIndex, moves, mode]);

  const fetchMovesAndStart = async () => {
    try {
      setVisitedCells([]);
      setScanArea([]);
      setMoves([]);
      setMoveIndex(0);
      setStepInfo(null);
      setPlanePosition(startPosition);

      let endpoint = "";
      if (algorithm === "BFS") endpoint = "breadth";
      else if (algorithm === "DFS") endpoint = "depth";
      else if (algorithm === "astar") endpoint = "astar";

      const res = await fetch(`http://127.0.0.1:5000/api/${endpoint}`);
      const data = await res.json();
      const path = Array.isArray(data[0]) ? data[0] : data.path;
      const formatted = path.map(([r, c, d]) => ({ row: r, col: c, direction: d || "E" }));
      setMoves(formatted);
      setMovesLength(formatted.length);
      setAlgorithmResult(data);

      if (mode === "Automatic") setRunning(true);
    } catch (err) {
      console.error("Error fetching path:", err);
    }
  };

  const handleOutputClick = async () => {
    if (!algorithmResult) return alert("No algorithm output to save!");
    try {
      const response = await fetch("/api/save-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...algorithmResult, algorithm }),
      });
      const data = await response.json();
      if (data.status === "success") {
        alert(`Output saved successfully to:\n${data.filename}`);
      } else {
        alert("Failed to save output.");
      }
    } catch (err) {
      console.error("Output save error:", err);
      alert("An error occurred while saving the file.");
    }
  };

  const getScanCells = (x, y, direction) => {
    const offsets = {
      N: [[-1, -1], [-1, 0], [-1, 1], [-2, -1], [-2, 0], [-2, 1]],
      S: [[1, -1], [1, 0], [1, 1], [2, -1], [2, 0], [2, 1]],
      E: [[-1, 1], [0, 1], [1, 1], [-1, 2], [0, 2], [1, 2]],
      W: [[-1, -1], [0, -1], [1, -1], [-1, -2], [0, -2], [1, -2]],
    };
    return offsets[direction]
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([nx, ny]) =>
        nx >= 0 &&
        ny >= 0 &&
        nx < grid.length &&
        ny < grid[0].length &&
        grid[nx][ny] === 0
      )
      .map(([nx, ny]) => `${nx}-${ny}`);
  };

  const getRotationAngle = (direction) => {
    switch (direction) {
      case "N": return "270deg";
      case "S": return "90deg";
      case "W": return "180deg";
      default: return "0deg";
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <div style={{ border: "2px solid #ccc", padding: "10px" }}>
        {grid.length === 0 ? (
          <p>Loading grid...</p>
        ) : (
          <>
            <table style={{ borderCollapse: "collapse" }}>
              <tbody>
                {grid.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => {
                      const isScan = scanArea.includes(`${rowIndex}-${colIndex}`);
                      const isVisited = visitedCells.includes(`${rowIndex}-${colIndex}`);
                      return (
                        <td
                          key={`${rowIndex}-${colIndex}`}
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor:
                              cell === 1
                                ? "#000"
                                : isScan
                                ? "yellow"
                                : isVisited
                                ? "#63c5da"
                                : "#fff",
                          }}
                        >
                          {planePosition?.row === rowIndex &&
                            planePosition?.col === colIndex && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  width: "100%",
                                  height: "100%",
                                  transform: `rotate(${getRotationAngle(planePosition.direction)})`,
                                  transition: "transform 0.3s ease",
                                }}
                              >
                                <FontAwesomeIcon icon={faPlane} size="xs" color="blue" />
                              </div>
                            )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {mode === "Automatic" && !running && algorithmResult && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <button
                  onClick={handleOutputClick}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Output File
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GridWork;