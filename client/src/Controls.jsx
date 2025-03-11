import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Controls = ({ algorithm, setAlgorithm, mode, setMode, setRunning }) => {
    return (
        <div className="controls-container">
            <div className="selection">
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

            <div className="mode-selection">
                <button onClick={() => setMode("Manual")} className={mode === "Manual" ? "selected" : ""}>Manual</button>
                <button onClick={() => setMode("Automatic")} className={mode === "Automatic" ? "selected" : ""}>Automatic</button>
            </div>

            {mode === "Automatic" && (
                <button className="play-button" onClick={() => setRunning(true)}>
                    <FontAwesomeIcon icon={faPlay} /> Play
                </button>
            )}

            <div className="current-selection">
                <h3>Current Selection:</h3>
                <p>Algorithm: {algorithm}</p>
                <p>Mode: {mode}</p>
            </div>
        </div>
    );
};

export default Controls;
