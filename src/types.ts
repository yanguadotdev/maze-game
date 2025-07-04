// Tipos para el laberinto
export type Cell = {
  x: number;
  y: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  isPath: boolean;
  isBacktrack: boolean;
  isPlayerPath: boolean;
  pathNumber?: number;
};

export type Position = {
  x: number;
  y: number;
};

export type GameMode = 'player' | 'ai';