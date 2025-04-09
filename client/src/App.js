import React, { useState } from "react";
import Controls from "./Controls";
import "./App.css";
import GridWork from "./GridWork";
import {FaGithub} from "react-icons/fa";

const App = () => {
    const [algorithm, setAlgorithm] = useState("DFS");
    const [mode, setMode] = useState("Manual");
    const [running, setRunning] = useState(false);

    return (
        <div align="grid">
            <header className="header">
        <div className="container">
          <a href="/" className="logo">
            Team N
          </a>
          <nav className="nav">
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#team" className="nav-link">
              Team
            </a>
            <a href="https://github.com/CS4091/TEAM_N" className="button">
              View on GitHub
            </a>
          </nav>
        </div>
      </header>
            <div className="subheader">
                <h1>Testing Controls</h1>
                <p>Grid Display</p>
            </div>
            <div className="grid-container">
                <GridWork
                    algorithm={algorithm}
                    mode={mode}
                    running={running}
                    setRunning={setRunning}/>
            </div>

            <Controls
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                mode={mode}
                setMode={setMode}
                setRunning={setRunning}
            />
        </div>
    )

};


export default App;
