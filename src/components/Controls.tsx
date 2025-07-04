import { Play, RotateCcw, Users, Zap, Settings } from 'lucide-react';
import React from 'react';
import type { GameMode } from '../types';

interface ControlsProps {
    gameMode: GameMode;
    setGameMode: (mode: GameMode) => void;
    handleGenerateNewMaze: () => void;
    handleResetGame: () => void;
    runAI: () => void;
    isAIRunning: boolean;
    savePlayerPath: () => void;
    aiSpeed: number;
    setAiSpeed: (speed: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
    gameMode,
    setGameMode,
    handleGenerateNewMaze,
    handleResetGame,
    runAI,
    isAIRunning,
    savePlayerPath,
    aiSpeed,
    setAiSpeed
}) => {
    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center justify-center">
                <button
                    onClick={handleGenerateNewMaze}
                    className="flex items-center gap-3 px-6 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <RotateCcw size={20} />
                    Nuevo Laberinto
                </button>

                <button
                    onClick={handleResetGame}
                    className="flex items-center gap-3 px-6 py-4 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <RotateCcw size={20} />
                    Reiniciar
                </button>

                <button
                    onClick={() => setGameMode(gameMode === 'player' ? 'ai' : 'player')}
                    className="flex items-center gap-3 px-6 py-4 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    <Users size={20} />
                    {gameMode === 'player' ? 'Modo IA' : 'Modo Jugador'}
                </button>

                {gameMode === 'ai' && (
                    <button
                        onClick={runAI}
                        disabled={isAIRunning}
                        className="flex items-center gap-3 px-6 py-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <Play size={20} />
                        {isAIRunning ? 'IA Ejecutándose...' : 'Ejecutar IA'}
                    </button>
                )}

                {gameMode === 'player' && (
                    <button
                        onClick={savePlayerPath}
                        className="flex items-center gap-3 px-6 py-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <Zap size={20} />
                        Guardar Path
                    </button>
                )}

                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-6 py-4 border border-gray-200">
                    <Settings size={20} className="text-gray-600" />
                    <label className="text-sm font-medium text-gray-700">Velocidad IA:</label>
                    <input
                        type="range"
                        min="50"
                        max="500"
                        value={aiSpeed}
                        onChange={(e) => setAiSpeed(parseInt(e.target.value))}
                        className="w-24 accent-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-600 min-w-12">{aiSpeed}ms</span>
                </div>
            </div>
        </div>
    );
};

export default Controls;
