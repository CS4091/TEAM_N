import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Controls = ({ algorithm, setAlgorithm, mode, setMode, running, setRunning }) => {
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
                    <div style={{ display: "flex", gap: "10px" }}>

                        <button
                            className="play-button"
                            onClick={() => setRunning(true)}
                            disabled={running}
                            style={{
                                padding: "10px 20px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                backgroundColor: running ? "#8BC34A" : "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: running ? "not-allowed" : "pointer",
                                transition: "background-color 0.3s ease"
                            }}
                            onMouseOver={(e) => {
                                if (!running) e.target.style.backgroundColor = "#45a049";
                            }}
                            onMouseOut={(e) => {
                                if (!running) e.target.style.backgroundColor = "#4CAF50";
                            }}
                        >
                            <FontAwesomeIcon icon={faPlay} style={{ marginRight: "5px" }} /> Play
                        </button>


                    </div>
                )}
            </div>
        </div>
    );
};

export default Controls;
