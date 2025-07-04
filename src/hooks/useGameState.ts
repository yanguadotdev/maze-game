import { useState } from 'react';
import type { GameMode, Position } from '../types';

export function useGameState() {
    const [gameMode, setGameMode] = useState<GameMode>('player');
    const [gameWon, setGameWon] = useState(false);
    const [aiSpeed, setAiSpeed] = useState(100);
    const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
    const [aiPosition, setAiPosition] = useState<Position>({ x: 0, y: 0 });
    const [aiStack, setAiStack] = useState<Position[]>([]);
    const [isAIRunning, setIsAIRunning] = useState(false);

    return {
        gameMode,
        setGameMode,
        gameWon,
        setGameWon,
        aiSpeed,
        setAiSpeed,
        playerPosition,
        setPlayerPosition,
        aiPosition,
        setAiPosition,
        aiStack,
        setAiStack,
        isAIRunning,
        setIsAIRunning
    };
}
