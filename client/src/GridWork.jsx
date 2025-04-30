// GridWork.jsx
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
  const [loading, setLoading] = useState(true);
  const [moves, setMoves] = useState([]);
  const [scanArea, setScanArea] = useState([]);
  const [algorithmResult, setAlgorithmResult] = useState(null);
  const [visitedCells, setVisitedCells] = useState([]);
  const [manualStarted, setManualStarted] = useState(false);
  const [showOutputButton, setShowOutputButton] = useState(false);

  useEffect(() => {
    const fetchGrid = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/get-map");
        const data = await response.json();
        if (data.grid && Array.isArray(data.grid)) {
          setGrid(data.grid);
          if (data.start_position && Array.isArray(data.start_position)) {
            const initial = {
              row: data.start_position[0],
              col: data.start_position[1],
              direction: "E"
            };
            setPlanePosition(initial);
            setStartPosition(initial);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching grid:", error);
        setLoading(false);
      }
    };
    fetchGrid();
  }, []);

  useEffect(() => {
    if ((running && mode === "Automatic") || (mode === "Manual" && manualStarted)) {
      fetchMovesAndStart();
    }
  }, [running, mode, manualStarted]);

  useEffect(() => {
    if (mode === "Manual") {
      setManualStarted(true);
      fetchMovesAndStart();
    } else {
      setManualStarted(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!manualStarted || mode !== "Manual" || moves.length === 0) return;
    const move = moves[moveIndex];
    if (move && move.row !== undefined && move.col !== undefined && move.direction) {
      setPlanePosition({ row: move.row, col: move.col, direction: move.direction });
      const newScan = getScanCells(move.row, move.col, move.direction);
      setScanArea(newScan);
      setVisitedCells(prev => [...new Set([...prev, `${move.row}-${move.col}`])]);
      setStepInfo({
        index: moveIndex + 1,
        total: moves.length,
        row: move.row,
        col: move.col,
        direction: move.direction,
        scannedCount: newScan.length
      });
    }
  }, [moveIndex, moves, mode, manualStarted]);

  const fetchMovesAndStart = async () => {
    setVisitedCells([]);
    setScanArea([]);
    setMoves([]);
    setMoveIndex(0);
    setShowOutputButton(false);
    if (startPosition) setPlanePosition(startPosition);
    try {
      let response = "";
      if (algorithm === "BFS") response = await fetch("http://127.0.0.1:5000/api/breadth");
      else if (algorithm === "DFS") response = await fetch("http://127.0.0.1:5000/api/depth");
      else if (algorithm === "astar") response = await fetch("http://127.0.0.1:5000/api/astar");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setAlgorithmResult(data);
      const path = Array.isArray(data[0]) ? data[0] : data.path;
      if (Array.isArray(path)) {
        const extractedMoves = path.filter(move => move.length >= 3).map(move => ({
          row: move[0],
          col: move[1],
          direction: move[2] || "E"
        }));
        setMoves(extractedMoves);
        setMovesLength(extractedMoves.length);
        setMoveIndex(0);
        if (mode === "Automatic") setRunning(true);
      } else {
        console.error("Invalid move data format.");
      }
    } catch (error) {
      console.error("Error fetching moves:", error);
    }
  };

  const stopExecution = () => {
    setRunning(false);
  };

  const getScanCells = (x, y, direction) => {
    const scan = [];
    const offsets = {
      N: [[-1, -1], [-1, 0], [-1, 1], [-2, -1], [-2, 0], [-2, 1]],
      S: [[1, -1], [1, 0], [1, 1], [2, -1], [2, 0], [2, 1]],
      E: [[-1, 1], [0, 1], [1, 1], [-1, 2], [0, 2], [1, 2]],
      W: [[-1, -1], [0, -1], [1, -1], [-1, -2], [0, -2], [1, -2]],
    };
    for (const [dx, dy] of offsets[direction]) {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newY >= 0 && newX < grid.length && newY < grid[0].length && grid[newX][newY] === 0) {
        scan.push(`${newX}-${newY}`);
      }
    }
    return scan;
  };

  const getRotationAngle = (direction) => {
    switch (direction) {
      case "N": return "270deg";
      case "E": return "0deg";
      case "S": return "90deg";
      case "W": return "180deg";
      default: return "0deg";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <div style={{ border: "2px solid #ccc", padding: "10px" }}>
        {loading ? (
          <p>Loading grid...</p>
        ) : grid.length > 0 ? (
          <>
            <div style={{ display: "flex" }}>
              <table cellPadding="0" style={{ marginBottom: "10px", borderCollapse: "collapse" }}>
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
                                cell === 1 ? "#000"
                                  : isScan ? "yellow"
                                    : isVisited ? "#63c5da"
                                      : "#fff",
                            }}
                          >
                            {planePosition &&
                              planePosition.row === rowIndex &&
                              planePosition.col === colIndex && (
                                <div
                                  key={planePosition.direction}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%",
                                    height: "100%",
                                    transform: `rotate(${getRotationAngle(planePosition.direction)})`,
                                    transition: "transform 0.3s ease"
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
            </div>
          </>
        ) : <p>No grid data available.</p>}
      </div>
    </div>
  );
};

export default GridWork;
