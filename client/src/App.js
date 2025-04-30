import React, { useState } from "react";
import Controls from "./Controls";
import GridWork from "./GridWork";

function App() {
  const [algorithm, setAlgorithm] = useState("DFS");
  const [mode, setMode] = useState(null);
  const [running, setRunning] = useState(false);
  const [moveIndex, setMoveIndex] = useState(0);
  const [stepInfo, setStepInfo] = useState(null);
  const [movesLength, setMovesLength] = useState(0);

  return (
    <>
      <Controls
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        mode={mode}
        setMode={setMode}
        running={running}
        setRunning={setRunning}
        moveIndex={moveIndex}
        setMoveIndex={setMoveIndex}
        movesLength={movesLength}
        stepInfo={stepInfo}
      />
      <GridWork
        algorithm={algorithm}
        mode={mode}
        running={running}
        setRunning={setRunning}
        moveIndex={moveIndex}
        setMoveIndex={setMoveIndex}
        setStepInfo={setStepInfo}
        stepInfo={stepInfo}
        setMovesLength={setMovesLength}
      />
    </>
  );
}

export default App;
