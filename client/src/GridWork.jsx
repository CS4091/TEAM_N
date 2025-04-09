import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

const GridWork = ({ algorithm, mode, running, setRunning }) => {
    const [grid, setGrid] = useState([]);
    const [planePosition, setPlanePosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [moves, setMoves] = useState([]);
    const [moveIndex, setMoveIndex] = useState(0);
    const [showOutputButton, setShowOutputButton] = useState(false);
    const [scanArea, setScanArea] = useState([]);

    useEffect(() => {
        const fetchGrid = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/get-map");
                const data = await response.json();

                if (data.grid && Array.isArray(data.grid)) {
                    setGrid(data.grid);
                    if (data.start_position && Array.isArray(data.start_position) && data.start_position.length === 2) {
                        setPlanePosition({
                            row: data.start_position[0],
                            col: data.start_position[1],
                            direction: "E"
                        });
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
        if (!running || moves.length === 0) return;

        let index = 0;
        const interval = setInterval(() => {
            if (!running) {
                clearInterval(interval);
                return;
            }
            if (index < moves.length) {
                const move = moves[index];
                console.log("Current Move:", move);
                if (move.row !== undefined && move.col !== undefined && move.direction) {
                    console.log("Setting plane direction to:", move.direction);
                    setPlanePosition({
                        row: move.row,
                        col: move.col,
                        direction: move.direction
                    });
                    setScanArea(getScanCells(move.row, move.col, move.direction));
                }
                index++;
            } else {
                clearInterval(interval);
                setRunning(false);
                setShowOutputButton(true);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [running, moves]);

    const fetchMovesAndStart = async () => {
        if (mode !== "Automatic") return;

        try {
            console.log(algorithm);
            let response = "";
            if (algorithm === "BFS") {
                response = await fetch("http://127.0.0.1:5000/api/breadth");
            }
            else if (algorithm === "DFS") {
                response = await fetch("http://127.0.0.1:5000/api/depth");
            }
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const path = Array.isArray(data[0]) ? data[0] : data.path;

            if (Array.isArray(path)) {
                const extractedMoves = path
                    .filter(move => move.length >= 3)
                    .map(move => ({
                        row: move[0],
                        col: move[1],
                        direction: move[2] || "E"
                    }));

                setMoves(extractedMoves);
                setMoveIndex(0);
                setRunning(true);
                setShowOutputButton(false);
            } else {
                console.error("Invalid move data format.");
            }
        } catch (error) {
            console.error("Error fetching moves:", error);
        }
    };

    useEffect(() => {
        if (running) fetchMovesAndStart();
    }, [running]);

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
            if (
                newX >= 0 && newY >= 0 &&
                newX < grid.length &&
                newY < grid[0].length &&
                grid[newX][newY] === 0
            ) {
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
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <div style={{ border: "2px solid #ccc", padding: "10px" }}>
                {loading ? (
                    <p>Loading grid...</p>
                ) : grid.length > 0 ? (
                    <>
                        <table
                            cellPadding="0"
                            style={{
                                marginBottom: "10px",
                                borderCollapse: "collapse"
                            }}
                        >
                            <tbody>
                                {grid.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, colIndex) => {
                                            const isScan = scanArea.includes(`${rowIndex}-${colIndex}`);
                                            const isLastCell =
                                                rowIndex === grid.length - 1 && colIndex === row.length - 1;
                                            return (
                                                <td
                                                    key={`${rowIndex}-${colIndex}`}
                                                    style={{
                                                        width: "12px",
                                                        height: "12px",
                                                        backgroundColor:
                                                            cell === 1
                                                                ? "#000"
                                                                : isScan
                                                                ? "yellow"
                                                                : "#fff",
                                                        border: isLastCell ? "1px solid #aaa" : "none"
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
                        {showOutputButton && (
                            <div style={{ textAlign: "center", marginTop: "10px" }}>
                                <button style={{ padding: "10px 20px" }}>Output File (placeholder)</button>
                            </div>
                        )}
                    </>
                ) : (
                    <p>No grid data available.</p>
                )}
            </div>
        </div>
    );
};

export default GridWork;
