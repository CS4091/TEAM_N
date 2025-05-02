import React, { useState } from "react";
import "./App.css";
import GridWork from "./GridWork";

const App = () => {
  const [algorithm, setAlgorithm] = useState("DFS");
  const [mode, setMode] = useState("Manual");
  const [running, setRunning] = useState(false);

  return (
    <div align="grid">
      <header className="header">
        <div className="header-container">
          <a href="/" className="logo">Team N</a>
          <nav className="nav">
            <a href="#about" className="nav-link">About</a>
            <a href="#team" className="nav-link">Team</a>
            <a href="https://github.com/CS4091/TEAM_N" className="button">View on GitHub</a>
          </nav>
        </div>
      </header>

      <div className="grid-container">
        <GridWork
          algorithm={algorithm}
          mode={mode}
          running={running}
          setRunning={setRunning}
        />
      </div>
    </div>
  );
};

export default function DualGameBoyPage() {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [movesLength, setMovesLength] = useState(0);
  const [stepInfo, setStepInfo] = useState(null);
  const [running, setRunning] = useState(false);

  return (
    <div className="gameboys-wrapper">
      <div className="w-1/2 min-w-[320px]">
        {/*<h2 className="text-white text-xl font-bold text-center mb-4">Algorithm Mode</h2>*/}
        <GridWork
          mode="Automatic"
          setMovesLength={setMovesLength}
          setRunning={setRunning}
        />
      </div>

      <div className="w-1/2 min-w-[320px]">
        {/*<h2 className="text-white text-xl font-bold text-center mb-4">Manual Mode</h2>*/}
        <GridWork
          mode="Manual"
          moveIndex={currentMoveIndex}
          setMoveIndex={setCurrentMoveIndex}
          setStepInfo={setStepInfo}
        />
      </div>
    </div>
  );
}
