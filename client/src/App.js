import React, { useState } from "react";
import Controls from "./Controls";
import GridTraversal from "./GridWork";
import "./App.css";
import GridWork from "./GridWork";

const App = () => {
    const [algorithm, setAlgorithm] = useState("DFS");
    const [mode, setMode] = useState("Manual");
    const [running, setRunning] = useState(false);

    return (
        <div align="center">
            <h1 style={{ color: "blue", marginBottom: "5px" }}>Testing Controls</h1>
            <h2 style={{ marginTop: "0px", marginBottom: "10px", color:"blue"}}>Grid Display</h2>

            <div className="grid-container">
                <GridWork />
            </div>

            <Controls
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                mode={mode}
                setMode={setMode}
                setRunning={setRunning}
            />
        </div>
    );
};


export default App;
