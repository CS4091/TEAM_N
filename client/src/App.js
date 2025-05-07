import React, { useState, useEffect } from "react";
import "./App.css";
import GridWork from "./GridWork";
import Header from "./header";

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

export default function DualGameBoyPage() {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [movesLength, setMovesLength] = useState(0);
  const [stepInfo, setStepInfo] = useState(null);
  const [running, setRunning] = useState(false);
  
  useEffect(() => {
    const button = document.getElementById("refresh-map");
    if (!button) return console.warn("Button #refresh-map not found");

    const handleClick = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/refresh-map");
        if (!response.ok) throw new Error("Network error");
        const data = await response.json();
        console.log("Map refreshed:", data);
        window.location.reload();
      } catch (error) {
        console.error("Refresh failed:", error);
      }
    };

    button.addEventListener("click", handleClick);


    return () => {
      button.removeEventListener("click", handleClick);
    };
  }, []);
  
  return (
    <div className="dual-wrapper">
      <Header />
      <button id="refresh-map" className="gameboy-button">Refresh Map</button>
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
