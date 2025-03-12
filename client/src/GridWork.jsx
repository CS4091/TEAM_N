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

                setLoading(false); // Ensure loading is set to false after API call
            } catch (error) {
                console.error("Error fetching grid:", error);
                setLoading(false); // Avoid infinite loading state
            }
        };

        fetchGrid();
    }, []);

    return (
        <div>
            <h2>Grid Display</h2>
            {loading ? (
                <p>Loading grid...</p>
            ) : grid.length > 0 ? ( // Ensure grid is not empty
                <table border="1" cellPadding="1" align={"center"}>
                    <tbody>
                        {grid.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                    <td
                                        key={`${rowIndex}-${colIndex}`}
                                        style={{
                                            width: "1px", // Increased for visibility
                                            height: "1px",
                                            textAlign: "center",
                                            backgroundColor: cell === 1 ? "black" : "white",
                                            border: "1px solid gray" // Border for better visibility
                                        }}
                                    >
                                        {planePosition &&
                                        planePosition.row === rowIndex &&
                                        planePosition.col === colIndex ? (
                                            <FontAwesomeIcon icon={faPlane} size="xs" color="blue" />
                                        ) : (
                                            ""
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No grid data available.</p> // Show message if grid is empty
            )}
        </div>
    );
};

export default GridWork;
