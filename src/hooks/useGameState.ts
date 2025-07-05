import { useEffect, useState } from 'react';
import type { GameMode, Position } from '../types';

export function useGameState() {
    const [gameMode, setGameMode] = useState<GameMode>('player');
    const [gameWon, setGameWon] = useState(false);
    const [aiSpeed, setAiSpeed] = useState(100);
    const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
    const [isAIRunning, setIsAIRunning] = useState(false);
    const [size, setSize] = useState(20)

    const resetGameState = () => {
        setGameMode('player');
        setPlayerPosition({ x: 0, y: 0 });
        setGameWon(false);
    };

    useEffect(() => {
        const setMazeSize = () => {
          const width = window.innerWidth;
      
          if (width <= 440) {
            setSize(8);
          } else if (width <= 600) {
            setSize(10);
          } else if (width <= 768) {
            setSize(14);
          } else {
            setSize(20);
          }
        };
      
        setMazeSize();
      
        window.addEventListener('resize', setMazeSize);
      
        return () => {
          window.removeEventListener('resize', setMazeSize);
        };
      }, []);
      
      

    return {
        gameMode,
        setGameMode,
        gameWon,
        setGameWon,
        aiSpeed,
        setAiSpeed,
        playerPosition,
        setPlayerPosition,
        isAIRunning,
        setIsAIRunning,
        resetGameState,
        size,
        setSize
    };
}
