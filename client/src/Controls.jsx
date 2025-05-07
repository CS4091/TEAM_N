import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const Controls = ({
    algorithm,
    setAlgorithm,
    mode,
    setMode,
    running,
    setRunning,
    moveIndex,
    setMoveIndex,
    movesLength,
    stepInfo
}) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "40px",
            width: "100%",
            marginTop: "20px"
        }}>

            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                {/*<div className="selection" style={{ marginBottom: "8px", textAlign: "center" }}>*/}
                {/*    <label>*/}
                {/*        <input*/}
                {/*            type="radio"*/}
                {/*            name="algorithm"*/}
                {/*            value="DFS"*/}
                {/*            checked={algorithm === "DFS"}*/}
                {/*            onChange={() => setAlgorithm("DFS")}*/}
                {/*        />*/}
                {/*        /!*DFS (Depth First Search)*!/*/}
                {/*    </label>*/}
                {/*    <br />*/}
                {/*    <label>*/}
                {/*        <input*/}
                {/*            type="radio"*/}
                {/*            name="algorithm"*/}
                {/*            value="BFS"*/}
                {/*            checked={algorithm === "BFS"}*/}
                {/*            onChange={() => setAlgorithm("BFS")}*/}
                {/*        />*/}
                {/*        /!*BFS (Breadth First Search)*!/*/}
                {/*    </label>*/}
                {/*</div>*/}

                <div className="mode-selection" style={{ marginBottom: "10px", textAlign: "center" }}>
                    {/*<button*/}
                    {/*    onClick={() => setMode("Manual")}*/}
                    {/*    className={mode === "Manual" ? "selected" : ""}*/}
                    {/*    style={{ marginRight: "5px", padding: "8px 16px", fontSize: "14px" }}*/}
                    {/*>*/}
                    {/*    Manual*/}
                    {/*</button>*/}
                    {/*<button*/}
                    {/*    onClick={() => setMode("Automatic")}*/}
                    {/*    className={mode === "Automatic" ? "selected" : ""}*/}
                    {/*    style={{ padding: "8px 16px", fontSize: "14px" }}*/}
                    {/*>*/}
                    {/*    Automatic*/}
                    {/*</button>*/}
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

                        <button
                            onClick={() => setRunning(false)}
                            style={{
                                padding: "10px 20px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "background-color 0.3s ease"
                            }}
                        >
                            Stop
                        </button>
                    </div>
                )}
            </div>

            {mode === "Manual" && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
                        <button style={{ padding: "10px 20px", fontSize: "16px" }} onClick={() => setMoveIndex(0)}>Restart</button>
                        <button style={{ padding: "10px 20px", fontSize: "16px" }} onClick={() => setMoveIndex(prev => Math.max(prev - 1, 0))}>Back</button>
                        <button style={{ padding: "10px 20px", fontSize: "16px" }} onClick={() => setMoveIndex(prev => Math.min(prev + 1, movesLength - 1))}>Next</button>
                    </div>

                    {stepInfo && (
                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                            <h4>Current Move:</h4>
                            <p>Step {stepInfo.index}/{stepInfo.total} — Moved {stepInfo.direction} to ({stepInfo.row}, {stepInfo.col})</p>
                            <p>Scanned: {stepInfo.scannedCount} cells</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Controls;
