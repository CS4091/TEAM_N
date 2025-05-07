import { useState, useEffect, useCallback, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlane, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { faStream, faSearch, faStar } from "@fortawesome/free-solid-svg-icons"
import "./GridWork.css"

const GridWork = ({
  algorithm = "BFS",
  mode = "Automatic", // "Automatic" or "Manual"
  initialRunning = false,
  setRunning: externalSetRunning = () => {},
  moveIndex = 0,
  setMoveIndex = () => {},
  setStepInfo = () => {},
  setMovesLength = () => {},
}) => {
  const [grid, setGrid] = useState([])
  const [planePosition, setPlanePosition] = useState(null)
  const [startPosition, setStartPosition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [moves, setMoves] = useState([])
  const [scanArea, setScanArea] = useState([])
  const [visitedCells, setVisitedCells] = useState([])
  const [pathCells, setPathCells] = useState([]) // Track the actual path
  const [algorithmResult, setAlgorithmResult] = useState(null)
  const [showOutputButton, setShowOutputButton] = useState(false)
  const [running, setRunning] = useState(initialRunning)
  const [algorithmDropdownVisible, setAlgorithmDropdownVisible] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithm)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAlgorithmDropdownVisible(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getScanCells = useCallback(
    (x, y, direction) => {
      const offsets = {
        N: [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [-2, -1],
          [-2, 0],
          [-2, 1],
        ],
        S: [
          [1, -1],
          [1, 0],
          [1, 1],
          [2, -1],
          [2, 0],
          [2, 1],
        ],
        E: [
          [-1, 1],
          [0, 1],
          [1, 1],
          [-1, 2],
          [0, 2],
          [1, 2],
        ],
        W: [
          [-1, -1],
          [0, -1],
          [1, -1],
          [-1, -2],
          [0, -2],
          [1, -2],
        ],
      }
      return offsets[direction]
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < grid.length && ny < grid[0].length && grid[nx][ny] === 0)
        .map(([nx, ny]) => `${nx}-${ny}`)
    },
    [grid],
  )

  useEffect(() => {
    const fetchGrid = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/get-map")
        const data = await res.json()
        setGrid(data.grid)
        const start = { row: data.start_position[0], col: data.start_position[1], direction: "E" }
        setPlanePosition(start)
        setStartPosition(start)
      } catch (err) {
        console.error("Failed to fetch grid:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchGrid()
  }, [])

  const updatePathCells = useCallback(
    (currentIndex) => {
      if (!moves || moves.length === 0) return

      // Create path cells up to the current index
      const path = moves.slice(0, currentIndex + 1).map((move) => `${move.row}-${move.col}`)
      setPathCells(path)
    },
    [moves],
  )

  const fetchMovesAndStart = useCallback(async () => {
    try {
      setVisitedCells([])
      setScanArea([])
      setMoves([])
      setPathCells([])
      setMoveIndex(0)
      setStepInfo(null)
      setPlanePosition(startPosition)

      let endpoint = ""
      if (selectedAlgorithm === "BFS") endpoint = "breadth"
      else if (selectedAlgorithm === "DFS") endpoint = "depth"
      else if (selectedAlgorithm === "astar") endpoint = "astar"

      const res = await fetch(`http://127.0.0.1:5000/api/${endpoint}`)
      const data = await res.json()
      const path = Array.isArray(data[0]) ? data[0] : data.path
      const formatted = path.map(([r, c, d]) => ({ row: r, col: c, direction: d || "E" }))

      setMoves(formatted)
      setMovesLength(formatted.length)
      setAlgorithmResult(data)

      if (mode === "Automatic") {
        setRunning(true)
        externalSetRunning(true)
      }
    } catch (err) {
      console.error("Path fetch failed:", err)
    }
  }, [selectedAlgorithm, mode, startPosition, setMoveIndex, setStepInfo, setMovesLength, externalSetRunning])

  useEffect(() => {
    if (running && mode === "Automatic") {
      let index = 0
      const interval = setInterval(() => {
        if (index < moves.length) {
          const move = moves[index]
          setPlanePosition(move)
          setScanArea(getScanCells(move.row, move.col, move.direction))
          setVisitedCells((prev) => [...new Set([...prev, `${move.row}-${move.col}`])])
          updatePathCells(index)
          index++
        } else {
          clearInterval(interval)
          setRunning(false)
          externalSetRunning(false)
          setShowOutputButton(true)
        }
      }, 120)
      return () => clearInterval(interval)
    }
  }, [running, moves, mode, getScanCells, externalSetRunning, updatePathCells])

  useEffect(() => {
    if (mode === "Manual" && moves.length > 0) {
      const move = moves[moveIndex]
      setPlanePosition(move)
      const newScan = getScanCells(move.row, move.col, move.direction)
      setScanArea(newScan)
      setVisitedCells((prev) => [...new Set([...prev, `${move.row}-${move.col}`])])
      updatePathCells(moveIndex)
      setStepInfo({
        index: moveIndex + 1,
        total: moves.length,
        row: move.row,
        col: move.col,
        direction: move.direction,
        scannedCount: newScan.length,
      })
    }
  }, [moveIndex, moves, mode, getScanCells, setStepInfo, updatePathCells])

  const handleOutputClick = async () => {
    if (!algorithmResult) return alert("No algorithm output to save.")
    try {
      const res = await fetch("/api/save-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...algorithmResult, algorithm: selectedAlgorithm }),
      })
      const data = await res.json()
      alert(data.status === "success" ? `Saved to:\n${data.filename}` : "Failed to save output.")
      setShowOutputButton(false)
    } catch (err) {
      console.error("Save failed:", err)
      alert("Error while saving.")
    }
  }

  const getRotationAngle = (dir) => ({ N: "270deg", E: "0deg", S: "90deg", W: "180deg" })[dir] || "0deg"

  const handleDPadPress = (dir) => {
    if (!planePosition) return

    const oppositeDirection = {
      N: "S",
      S: "N",
      E: "W",
      W: "E",
    }

    if (mode === "Manual" && moves.length > 0) {
      let newIndex = moveIndex
      switch (dir) {
        case "up":
          newIndex = Math.max(0, moveIndex - 1)
          break
        case "down":
          newIndex = Math.min(moves.length - 1, moveIndex + 1)
          break
        case "left":
          newIndex = 0
          break
        case "right":
          newIndex = moves.length - 1
          break
        default:
          return
      }
      if (newIndex !== moveIndex) {
        setMoveIndex(newIndex)
      }
    } else {
      let { row, col, direction } = planePosition
      let newDirection = direction
      let newRow = row
      let newCol = col

      switch (dir) {
        case "up":
          newDirection = "N"
          newRow = Math.max(0, row - 1)
          break
        case "down":
          newDirection = "S"
          newRow = Math.min(grid.length - 1, row + 1)
          break
        case "left":
          newDirection = "W"
          newCol = Math.max(0, col - 1)
          break
        case "right":
          newDirection = "E"
          newCol = Math.min(grid[0].length - 1, col + 1)
          break
        default:
          return
      }

      // Don't allow U-turn
      if (newDirection === oppositeDirection[direction]) {
        console.log("U-turns not allowed")
        return
      }

      // Check if the new position is within bounds
      // Check if the new position is within bounds
      const isWithinBounds = newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length
      const isNotObstacle = isWithinBounds && grid[newRow][newCol] !== 1

      // Only move and rotate if the move is valid
      if (isNotObstacle && isWithinBounds) {
        // Prevent U-turn
        if (newDirection === oppositeDirection[direction]) {
          console.log("U-turns not allowed")
          return
        }

        setPlanePosition({ row: newRow, col: newCol, direction: newDirection })
        setScanArea(getScanCells(newRow, newCol, newDirection))
      }
    }
  }


  const handleButtonPress = (btn) => {
    if (btn === "A") {
      if (mode === "Automatic") {
        const newState = !running
        setRunning(newState)
        externalSetRunning(newState)
      } else if (mode === "Manual" && moveIndex < moves.length - 1) {
        setMoveIndex(moveIndex + 1)
      }
    } else if (btn === "B") {
      // B button now handles output
      if (algorithmResult) {
        handleOutputClick()
      }
    } else if (btn === "start") {
      fetchMovesAndStart()
    } else if (btn === "select") {
      // Toggle algorithm dropdown
      setAlgorithmDropdownVisible(!algorithmDropdownVisible)
    }
  }

  const getAlgorithmIcon = (algo) => {
    switch (algo) {
      case "BFS":
        return faStream
      case "DFS":
        return faSearch
      case "astar":
        return faStar
      default:
        return faStream
    }
  }

  // Run all algorithms in sequence (for the algorithm Game Boy)
  const runAllAlgorithms = async () => {
    const algorithms = ["BFS", "DFS", "astar"]
    for (const algo of algorithms) {
      setSelectedAlgorithm(algo)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Small delay between algorithm changes
      await fetchMovesAndStart()
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!running) {
            clearInterval(checkInterval)
            resolve()
          }
        }, 100)
      })
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Pause between algorithms
    }
  }

  return (
    <div className="gameboy-container">
      <div className="gameboy-body">
        <div className="gameboy-logo">
          <span className="gameboy-logo-text">GAME BOY</span>
          <span className="gameboy-logo-c">C</span>
          <span className="gameboy-logo-o">O</span>
          <span className="gameboy-logo-l">L</span>
          <span className="gameboy-logo-o2">O</span>
          <span className="gameboy-logo-r">R</span>
        </div>

        {/* Screen Frame */}
        <div className="screen-frame">
          {/* Power indicator */}
          <div className="power-indicator">
          </div>

          <div className="screen">
            {/* Algorithm and Mode Display */}
            <div className="algorithm-display">
              <span className="algorithm-text">
                <FontAwesomeIcon icon={getAlgorithmIcon(selectedAlgorithm)} style={{ marginRight: "4px" }} />
                {selectedAlgorithm}
              </span>
              <span className="mode-text">{mode}</span>
            </div>

            {/* Grid Visualization */}
            <div className="grid-container">
              {loading ? (
                <p className="loading-text">Loading grid...</p>
              ) : grid.length === 0 ? (
                <p className="error-text">No grid data available.</p>
              ) : (
                <>
                  <table className="grid-table">
                    <tbody>
                      {grid.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => {
                            const cellKey = `${rowIndex}-${colIndex}`
                            const isScan = scanArea.includes(cellKey)
                            const isVisited = visitedCells.includes(cellKey)
                            const isPath = pathCells.includes(cellKey)

                            const cellClass = `grid-cell ${cell === 1 ? "grid-cell-obstacle" : ""} ${
                              isScan ? "grid-cell-scan" : ""
                            } ${isPath ? "grid-cell-path" : isVisited ? "grid-cell-visited" : ""} ${
                              !cell && !isScan && !isVisited && !isPath ? "grid-cell-empty" : ""
                            }`

                            return (
                              <td key={cellKey} className={cellClass}>
                                {planePosition?.row === rowIndex && planePosition?.col === colIndex && (
                                  <div
                                    className="plane-container"
                                    style={{
                                      transform: `rotate(${getRotationAngle(planePosition.direction)})`,
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faPlane} size="xs" color="blue" />
                                  </div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Step Info Display */}
                  {mode === "Manual" && moves.length > 0 && (
                    <div className="step-info">
                      <span>
                        Step: {moveIndex + 1}/{moves.length}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Nintendo logo */}
        <div className="nintendo-logo">TEAM N</div>

        {/* Game Boy Controls */}
        <div className="controls-container">
          {/* D-pad */}
          <div className="dpad">
            <div className="dpad-base"></div>
            <button className="dpad-button dpad-up" onClick={() => handleDPadPress("up")} aria-label="Previous Step">
              <div className="arrow-up"></div>
            </button>
            <button className="dpad-button dpad-down" onClick={() => handleDPadPress("down")} aria-label="Next Step">
              <div className="arrow-down"></div>
            </button>
            <button className="dpad-button dpad-left" onClick={() => handleDPadPress("left")} aria-label="First Step">
              <div className="arrow-left"></div>
            </button>
            <button className="dpad-button dpad-right" onClick={() => handleDPadPress("right")} aria-label="Last Step">
              <div className="arrow-right"></div>
            </button>
            <div className="dpad-center">
              <div className="dpad-center-dot"></div>
            </div>
          </div>

          {/* A/B buttons */}
          <div className="ab-buttons">
            <button className="button-b" onClick={() => handleButtonPress("B")} aria-label="Output File">
              B
            </button>
            <button className="button-a" onClick={() => handleButtonPress("A")} aria-label="Next Step/Start">
              A
            </button>
          </div>

          {/* Start/Select buttons with Algorithm Dropdown */}
          <div className="start-select-buttons">
            {mode === "Automatic" && (
              <div className="select-dropdown-container" ref={dropdownRef}>
                <button
                  className="button-select"
                  onClick={() => setAlgorithmDropdownVisible(!algorithmDropdownVisible)}
                  aria-label="Select Algorithm"
                >
                  SELECT <FontAwesomeIcon icon={faChevronDown} size="xs" className="dropdown-icon" />
                </button>

                {algorithmDropdownVisible && (
                  <div className="algorithm-dropdown">
                    <button
                      className={`dropdown-item ${selectedAlgorithm === "BFS" ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedAlgorithm("BFS")
                        setAlgorithmDropdownVisible(false)
                        fetchMovesAndStart()
                      }}
                    >
                      BFS
                    </button>
                    <button
                      className={`dropdown-item ${selectedAlgorithm === "DFS" ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedAlgorithm("DFS")
                        setAlgorithmDropdownVisible(false)
                        fetchMovesAndStart()
                      }}
                    >
                      DFS
                    </button>
                    <button
                      className={`dropdown-item ${selectedAlgorithm === "astar" ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedAlgorithm("astar")
                        setAlgorithmDropdownVisible(false)
                        fetchMovesAndStart()
                      }}
                    >
                      A*
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setAlgorithmDropdownVisible(false)
                        runAllAlgorithms()
                      }}
                    >
                      Run All
                    </button>
                  </div>
                )}
              </div>
            )}
            {mode === "Manual" && (
              <button className="button-select" disabled aria-label="Select Algorithm">
                SELECT
              </button>
            )}
            <button className="button-start" onClick={() => handleButtonPress("start")} aria-label="Run Algorithm">
              START
            </button>
          </div>
        </div>

        {/* Speaker holes */}
        <div className="speaker-holes">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="speaker-hole"></div>
          ))}
        </div>

        <div className="instructions">
          <p>
            {mode === "Manual"
              ? "D-Pad: Navigate steps • A: Next step • B: Output file • START: Run"
              : "A: Start/Stop • B: Output file • SELECT: Algorithm • START: Run"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default GridWork