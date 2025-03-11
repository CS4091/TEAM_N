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
        <div className="app-container">
            <h1>Testing Controls</h1>
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
