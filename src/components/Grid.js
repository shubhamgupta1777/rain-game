export const createEmptyGrid = (config) =>
  Array.from({ length: config.rows }, () =>
    Array.from({ length: config.cols }, () => null)
  );
