import { useCallback } from 'react';
import type { Cell, Position } from '../types';

/**
 * Hook para generar laberintos usando algoritmo de backtracking.
 * 
 * @param size tamaño del laberinto
 * @returns { generateMaze } función que genera un nuevo laberinto
 */
export function useMazeGenerator(size: number) {
  /**
   * Retorna los vecinos no visitados de una celda
   */
  const getUnvisitedNeighbors = (pos: Position, maze: Cell[][]): Position[] => {
    const neighbors: Position[] = [];
    const { x, y } = pos;

    if (y > 0 && !maze[y - 1][x].visited) neighbors.push({ x, y: y - 1 });
    if (x < size - 1 && !maze[y][x + 1].visited) neighbors.push({ x: x + 1, y });
    if (y < size - 1 && !maze[y + 1][x].visited) neighbors.push({ x, y: y + 1 });
    if (x > 0 && !maze[y][x - 1].visited) neighbors.push({ x: x - 1, y });

    return neighbors;
  };

  /**
   * Elimina la pared entre la celda actual y la siguiente
   */
  const removeWall = (current: Position, next: Position, maze: Cell[][]) => {
    const dx = current.x - next.x;
    const dy = current.y - next.y;

    if (dx === 1) {
      maze[current.y][current.x].walls.left = false;
      maze[next.y][next.x].walls.right = false;
    } else if (dx === -1) {
      maze[current.y][current.x].walls.right = false;
      maze[next.y][next.x].walls.left = false;
    } else if (dy === 1) {
      maze[current.y][current.x].walls.top = false;
      maze[next.y][next.x].walls.bottom = false;
    } else if (dy === -1) {
      maze[current.y][current.x].walls.bottom = false;
      maze[next.y][next.x].walls.top = false;
    }
  };

  /**
   * Genera un laberinto nuevo y retorna la matriz de celdas
   */
  const generateMaze = useCallback((): Cell[][] => {
    const newMaze: Cell[][] = [];

    // Inicializar grid
    for (let y = 0; y < size; y++) {
      newMaze[y] = [];
      for (let x = 0; x < size; x++) {
        newMaze[y][x] = {
          x,
          y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
          isPath: false,
          isBacktrack: false,
          isPlayerPath: false
        };
      }
    }

    // Backtracking
    const stack: Position[] = [];
    const current = { x: 0, y: 0 };
    newMaze[0][0].visited = true;
    stack.push(current);

    while (stack.length > 0) {
      const neighbors = getUnvisitedNeighbors(current, newMaze);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWall(current, next, newMaze);
        newMaze[next.y][next.x].visited = true;
        stack.push({ ...current });
        current.x = next.x;
        current.y = next.y;
      } else {
        const prev = stack.pop()!;
        current.x = prev.x;
        current.y = prev.y;
      }
    }

    // Limpiar flags de generación
    newMaze.forEach(row => row.forEach(cell => {
      cell.visited = false;
      cell.isPath = false;
      cell.isBacktrack = false;
      cell.isPlayerPath = false;
    }));

    return newMaze;
  }, [size]);

  return { generateMaze };
}
