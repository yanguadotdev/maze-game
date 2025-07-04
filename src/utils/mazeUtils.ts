import type { Cell, Position } from '../types';

/**
 * Verify if a move is possible from one cell to another
 * @param from Cell origin
 * @param to Cell destination
 * @param maze Maze
 * @param size Maze size
 * @returns true if the move is possible
 */
export function canMove(from: Position, to: Position, maze: Cell[][], size: number): boolean {
    if (to.x < 0 || to.x >= size || to.y < 0 || to.y >= size) return false;

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    if (dx === 1) return !maze[from.y][from.x].walls.right;
    if (dx === -1) return !maze[from.y][from.x].walls.left;
    if (dy === 1) return !maze[from.y][from.x].walls.bottom;
    if (dy === -1) return !maze[from.y][from.x].walls.top;

    return false;
}
