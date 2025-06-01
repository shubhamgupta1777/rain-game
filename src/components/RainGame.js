import { useState } from "react";
import RainGrid from "./RainGrid";
import "../style/RainGame.css";

const RainGame = () => {
  const [fallSpeed, setFallSpeed] = useState(50);
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="wrapper">
      <div>
        <h1>🌧️ Rainfall Game</h1>

        <div className="btns-container">
          <button className="btn" onClick={() => setIsRunning(true)}>
            Start
          </button>

          <button className="btn" onClick={() => setIsRunning(false)}>
            Pause
          </button>

          <button
            className="btn"
            onClick={() => {
              setIsRunning(false);
              setResetKey((prev) => prev + 1);
            }}
          >
            Reset
          </button>
        </div>
        <hr></hr>

        <div className="options-container">
          <div className="options">
            ⬇️ Fall Speed (ms):
            <select
              value={fallSpeed}
              onChange={(e) => setFallSpeed(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => 10 + i * 10).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="options">
            🧱 Rows:
            <select
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="options">
            🧱 Columns:
            <select
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
            >
              {Array.from({ length: 50 }, (_, i) => 1 + i).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <RainGrid
        fallSpeed={fallSpeed}
        rows={rows}
        cols={cols}
        isRunning={isRunning}
        resetKey={resetKey}
      />
    </div>
  );
};

export default RainGame;
