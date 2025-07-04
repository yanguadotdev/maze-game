import { useState } from 'react';
import type { Position, Cell } from '../types';

interface UsePlayerPathsOptions {
    size: number;
    setPlayerPosition: (pos: Position) => void;
    setGameWon: (won: boolean) => void;
    maze: Cell[][];
    setMaze: (maze: Cell[][]) => void;
}

export function usePlayerPaths({
    size,
    setPlayerPosition,
    setGameWon,
    maze,
    setMaze
}: UsePlayerPathsOptions) {
    const [playerPaths, setPlayerPaths] = useState<Position[][]>([]);
    const [currentPlayerPath, setCurrentPlayerPath] = useState<Position[]>([]);
    const [selectedPath, setSelectedPath] = useState<number | null>(null);

    const savePlayerPath = () => {
        if (currentPlayerPath.length > 1) {
            const newPaths = [...playerPaths, currentPlayerPath];
            setPlayerPaths(newPaths);
            setCurrentPlayerPath([{ x: 0, y: 0 }]);
            setPlayerPosition({ x: 0, y: 0 });

            const newMaze = maze.map(row => row.map(cell => ({ ...cell })));
            newPaths.forEach((path, pathIndex) => {
                path.forEach(pos => {
                    newMaze[pos.y][pos.x].isPlayerPath = true;
                    newMaze[pos.y][pos.x].pathNumber = pathIndex + 1;
                });
            });
            setMaze(newMaze);
        }
    };

    const selectPath = (pathIndex: number) => {
        setSelectedPath(pathIndex);
        const path = playerPaths[pathIndex];

        let step = 0;
        const animateSelection = () => {
            if (step < path.length) {
                setPlayerPosition(path[step]);
                step++;
                setTimeout(animateSelection, 200);
            } else {
                const last = path[path.length - 1];
                if (last.x === size - 1 && last.y === size - 1) {
                    setGameWon(true);
                }
            }
        };
        animateSelection();
    };

    const resetPaths = () => {
        setPlayerPaths([]);
        setCurrentPlayerPath([{ x: 0, y: 0 }]);
        setSelectedPath(null);
    };

    return {
        playerPaths,
        currentPlayerPath,
        setCurrentPlayerPath,
        selectedPath,
        savePlayerPath,
        selectPath,
        resetPaths
    };
}
