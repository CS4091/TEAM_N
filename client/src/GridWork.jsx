import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane } from "@fortawesome/free-solid-svg-icons";

const GridWork = () => {
    const [grid, setGrid] = useState([]);
    const [planePosition, setPlanePosition] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the grid and starting position from API
    useEffect(() => {
        const fetchGrid = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/get-map");
                const data = await response.json();

                console.log("API Response:", data);

                if (data.grid && Array.isArray(data.grid)) {
                    setGrid(data.grid);


                    if (Array.isArray(data.start_position) && data.start_position.length === 2) {
                        setPlanePosition({ row: data.start_position[0], col: data.start_position[1] });
                    } else {
                        console.error("Invalid start position:", data.start_position);
                    }

                    setLoading(false);  // ✅ Hide loading message
                } else {
                    console.error("Invalid grid data from API:", data);
                }
            } catch (error) {
                console.error("Error fetching grid:", error);
            }
        };

        fetchGrid();
    }, []);

    return (
        <div className="grid-box">
            {loading ? (
                <p>Loading grid...</p>
            ) : (
                grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div key={`${rowIndex}-${colIndex}`} className="grid-cell">
                            {planePosition?.row === rowIndex && planePosition?.col === colIndex && (
                                <FontAwesomeIcon icon={faPlane} size="lg" />
                            )}
                        </div>
                    ))
                )
            )}
        </div>
    );
};

export default GridWork;
