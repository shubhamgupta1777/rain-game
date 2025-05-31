import React, { useEffect, useState, useRef } from "react";
import chroma from "chroma-js";

const defaultConfig = {
  isRunning: false,
  resetKey: 0,
  rows: 15,
  cols: 20,
  dropLength: 6,
  fallSpeed: 50,
  transitionDuration: 7500,
  colorFamilies: ["#ff00ff", "#00ffff", "#00ff00", "#ffff00", "#ff4500"],
  dropChance: 0.5,
  cellSize: 20,
  gap: 2,
};


const lerpColor = (a, b, t) => chroma.mix(a, b, t, "rgb").hex();

const getShade = (hex, index) => {
  const alpha = 1 - index * 0.15;
  return chroma(hex).alpha(alpha).hex("rgba");
};

const createEmptyGrid = (rows, cols) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));

const RainGrid = (props) => {
  const config = { ...defaultConfig, ...props }; 

  const [drops, setDrops] = useState([]);
  const [grid, setGrid] = useState(() =>
    createEmptyGrid(config.rows, config.cols)
  );
  const [colorIndex, setColorIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const animationRef = useRef(null);

  const fromColor = config.colorFamilies[colorIndex];
  const toColor =
    config.colorFamilies[(colorIndex + 1) % config.colorFamilies.length];


  useEffect(() => {
    setGrid(createEmptyGrid(config.rows, config.cols));
    setDrops([]); 
  }, [config.rows, config.cols]);


  useEffect(() => {
    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / config.transitionDuration, 1);
      setTransitionProgress(t);

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setColorIndex((prev) => (prev + 1) % config.colorFamilies.length);
        setTransitionProgress(0);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [colorIndex, config.transitionDuration, config.colorFamilies.length]);

  useEffect(() => {
    setDrops([]); 
  }, [config.resetKey]);

  useEffect(() => {
    if (!config.isRunning) return;

    const interval = setInterval(() => {
      setDrops((prev) =>
        prev
          .map((d) => ({ ...d, headRow: d.headRow + 1 }))
          .filter((d) => d.headRow - config.dropLength < config.rows)
          .concat(
            Math.random() < config.dropChance
              ? [
                  {
                    column: Math.floor(Math.random() * config.cols),
                    headRow: 0,
                  },
                ]
              : []
          )
      );
    }, config.fallSpeed);

    return () => clearInterval(interval);
  }, [config.isRunning, config.fallSpeed, config.rows, config.cols, config.dropLength, config.dropChance]);


  useEffect(() => {
    const blendedColor = lerpColor(fromColor, toColor, transitionProgress);
    const newGrid = createEmptyGrid(config.rows, config.cols);

    drops.forEach((drop) => {
      for (let i = 0; i < config.dropLength; i++) {
        const row = drop.headRow - i;
        if (row >= 0 && row < config.rows) {
          newGrid[row][drop.column] = getShade(blendedColor, i);
        }
      }
    });

    setGrid(newGrid);
  }, [
    drops,
    transitionProgress,
    fromColor,
    toColor,
    config.rows,
    config.cols,
    config.dropLength,
  ]);

  return (
    <div>
        <div
          style={{
            display: "grid",
            gridTemplateRows: `repeat(${config.rows}, ${config.cellSize}px)`,
            gridTemplateColumns: `repeat(${config.cols}, ${config.cellSize}px)`,
            gap: `${config.gap}px`,
            backgroundColor: "#111",
            padding: "10px",
          }}
        >
          {grid.flat().map((color, i) => (
            <div
              key={i}
              style={{
                width: config.cellSize,
                height: config.cellSize,
                backgroundColor: color || "#222",
                transition: "background-color linear",
              }}
            />
          ))}
        </div>
      </div>
  );
};

export default RainGrid;
