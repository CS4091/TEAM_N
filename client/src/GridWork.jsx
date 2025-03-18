import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

const GridWork = () => {
    const [grid, setGrid] = useState([]);
    const [planePosition, setPlanePosition] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrid = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/get-map");
                const data = await response.json();

                console.log("API Response:", data);

                if (data.grid && Array.isArray(data.grid)) {
                    console.log("Grid Data:", data.grid);

                    if (!data.grid.some(row => row.includes(1))) {
                        console.error("No walls detected in API response!");
                    }

                    setGrid(data.grid);

                    if (
                        data.start_position &&
                        Array.isArray(data.start_position) &&
                        data.start_position.length === 2 &&
                        typeof data.start_position[0] === "number" &&
                        typeof data.start_position[1] === "number"
                    ) {
                        setPlanePosition({
                            row: data.start_position[0],
                            col: data.start_position[1]
                        });
                    } else {
                        console.error("Invalid start position received:", data.start_position);
                    }
                } else {
                    console.error("Invalid grid data from API:", data);
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
        console.log("Updated grid:", grid);
    }, [grid]);

    return (
        <div>
            {loading ? (
                <p>Loading grid...</p>
            ) : grid.length > 0 ? (
                <table cellPadding="0" style={{ marginBottom: "10px", borderCollapse: "collapse" }}>
                    <tbody>
                        {grid.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                    <td
                                        key={`${rowIndex}-${colIndex}`}
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            backgroundColor: cell === 1 ? "#000000" : "#FFFFFF",
                                            border: cell === 1 ? "1px solid black" : "1px solid gray",
                                        }}
                                    >
                                        {planePosition &&
                                        planePosition.row === rowIndex &&
                                        planePosition.col === colIndex ? (
                                            <FontAwesomeIcon icon={faPlane} size="xs" color="blue" />
                                        ) : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No grid data available.</p>
            )}
        </div>
    );
};

export default GridWork;
