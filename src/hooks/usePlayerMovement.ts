import { useEffect, useCallback } from 'react';
import type { Position } from '../types';

interface UsePlayerMovementOptions {
    canMove: (from: Position, to: Position) => boolean;
    isAIRunning: boolean;
    gameMode: string;
    gameWon: boolean;
    playerPosition: Position;
    setPlayerPosition: (pos: Position) => void;
    currentPlayerPath: Position[];
    setCurrentPlayerPath: (path: Position[]) => void;
    size: number;
    onWin: () => void;
}

export function usePlayerMovement({
    canMove,
    isAIRunning,
    gameMode,
    gameWon,
    playerPosition,
    setPlayerPosition,
    currentPlayerPath,
    setCurrentPlayerPath,
    size,
    onWin
}: UsePlayerMovementOptions) {
    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (gameMode !== 'player' || gameWon || isAIRunning) return;

        const { x, y } = playerPosition;
        let newPos: Position | null = null;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                newPos = { x, y: y - 1 };
                break;
            case 'ArrowDown':
                e.preventDefault();
                newPos = { x, y: y + 1 };
                break;
            case 'ArrowLeft':
                e.preventDefault();
                newPos = { x: x - 1, y };
                break;
            case 'ArrowRight':
                e.preventDefault();
                newPos = { x: x + 1, y };
                break;
        }

        if (newPos && canMove(playerPosition, newPos)) {
            setPlayerPosition(newPos);
            setCurrentPlayerPath([...currentPlayerPath, newPos]);

            if (newPos.x === size - 1 && newPos.y === size - 1) {
                onWin();
            }
        }
    }, [
        gameMode,
        gameWon,
        isAIRunning,
        playerPosition,
        canMove,
        currentPlayerPath,
        setPlayerPosition,
        setCurrentPlayerPath,
        size,
        onWin
    ]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);
}
