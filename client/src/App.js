import React, { useState } from "react";
import "./App.css";
import GridWork from "./GridWork";
import Header from "./header"; // Ensure this Header component uses a <div className="container"> wrapper

// Standard App view
export const App = () => {
  const [algorithm, setAlgorithm] = useState("DFS");
  const [mode, setMode] = useState("Manual");
  const [running, setRunning] = useState(false);

  return (
    <div className="app-wrapper">
      <Header />
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

// DualGameBoyPage view (remains in the same file)
export default function DualGameBoyPage() {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [movesLength, setMovesLength] = useState(0);
  const [stepInfo, setStepInfo] = useState(null);
  const [running, setRunning] = useState(false);

  return (
    <div className="dual-wrapper">
      <Header />
      <div className="gameboys-wrapper">
        <div className="w-1/2 min-w-[320px]">
          <GridWork
            mode="Automatic"
            setMovesLength={setMovesLength}
            setRunning={setRunning}
          />
        </div>
        <div className="w-1/2 min-w-[320px]">
          <GridWork
            mode="Manual"
            moveIndex={currentMoveIndex}
            setMoveIndex={setCurrentMoveIndex}
            setStepInfo={setStepInfo}
          />
        </div>
      </div>
    </div>
  );
}
