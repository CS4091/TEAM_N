import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Controls = ({ algorithm, setAlgorithm, mode, setMode, setRunning }) => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            width: "100%"
        }}>

            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>

                <div className="selection" style={{ marginBottom: "8px", textAlign: "center" }}>
                    <label>
                        <input
                            type="radio"
                            name="algorithm"
                            value="DFS"
                            checked={algorithm === "DFS"}
                            onChange={() => setAlgorithm("DFS")}
                        />
                        DFS (Depth First Search)
                    </label>
                    <br />
                    <label>
                        <input
                            type="radio"
                            name="algorithm"
                            value="BFS"
                            checked={algorithm === "BFS"}
                            onChange={() => setAlgorithm("BFS")}
                        />
                        BFS (Breadth First Search)
                    </label>
                </div>


                <div className="mode-selection" style={{ marginBottom: "10px", textAlign: "center" }}>
                    <button
                        onClick={() => setMode("Manual")}
                        className={mode === "Manual" ? "selected" : ""}
                        style={{ marginRight: "5px", padding: "8px 16px", fontSize: "14px" }}
                    >
                        Manual
                    </button>
                    <button
                        onClick={() => setMode("Automatic")}
                        className={mode === "Automatic" ? "selected" : ""}
                        style={{ padding: "8px 16px", fontSize: "14px" }}
                    >
                        Automatic
                    </button>
                </div>


                {mode === "Automatic" && (
                    <button
                        className="play-button"
                        onClick={() => setRunning(true)}
                        style={{
                            padding: "10px 20px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
                    >
                        <FontAwesomeIcon icon={faPlay} style={{ marginRight: "5px" }} /> Play
                    </button>
                )}
            </div>


            <div style={{
                textAlign: "center",
                minWidth: "180px",
                padding: "8px",
                border: "1px solid lightgray",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)"
            }}>
                <h3 style={{ marginBottom: "6px", textDecoration: "underline" }}>Current Selection</h3>
                <p><strong>Algorithm:</strong> {algorithm}</p>
                <p><strong>Mode:</strong> {mode}</p>
            </div>
        </div>
    );
};

export default Controls;
