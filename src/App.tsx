import { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Users, Zap, Settings } from 'lucide-react';
import Maze from './components/Maze';
import type { Cell, GameMode, Position } from './types';
import GameStatus from './components/GameStatus';
import PlayerPaths from './components/PlayerPaths';
import AIStatus from './components/AIStatus';
import Instructions from './components/Instructions';
import { useMazeGenerator } from './hooks/useMazeGenerator';
import { useAIPathfinder } from './hooks/useAIPathfinder';
import { usePlayerMovement } from './hooks/usePlayerMovement';


const MazeSimulator = () => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [size] = useState(20);
  const [gameMode, setGameMode] = useState<GameMode>('player');
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [gameWon, setGameWon] = useState(false);
  const [playerPaths, setPlayerPaths] = useState<Position[][]>([]);
  const [currentPlayerPath, setCurrentPlayerPath] = useState<Position[]>([]);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [aiSpeed, setAiSpeed] = useState(100);

  const canMove = (from: Position, to: Position): boolean => {
    if (to.x < 0 || to.x >= size || to.y < 0 || to.y >= size) return false;

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    if (dx === 1) return !maze[from.y][from.x].walls.right;
    if (dx === -1) return !maze[from.y][from.x].walls.left;
    if (dy === 1) return !maze[from.y][from.x].walls.bottom;
    if (dy === -1) return !maze[from.y][from.x].walls.top;

    return false;
  };

  const { generateMaze } = useMazeGenerator(size);
  const {
    runAI,
    isAIRunning,
    aiPosition,
    aiStack,
    setAiPosition,
    setAiStack,
    setIsAIRunning
  } = useAIPathfinder({
    maze,
    size,
    aiSpeed,
    canMove,
    onFinish: () => setGameWon(true),
    updateMaze: setMaze
  });

  usePlayerMovement({
    canMove,
    isAIRunning,
    gameMode,
    gameWon,
    playerPosition,
    setPlayerPosition,
    currentPlayerPath,
    setCurrentPlayerPath,
    size,
    onWin: () => setGameWon(true)
  });


  const savePlayerPath = () => {
    if (currentPlayerPath.length > 1) {
      const newPaths = [...playerPaths, currentPlayerPath];
      setPlayerPaths(newPaths);
      setCurrentPlayerPath([{ x: 0, y: 0 }]);
      setPlayerPosition({ x: 0, y: 0 });

      // Actualizar maze con números de paths
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

    // Animación del path seleccionado
    let step = 0;
    const animateSelection = () => {
      if (step < path.length) {
        setPlayerPosition(path[step]);
        step++;
        setTimeout(animateSelection, 200);
      } else {
        if (path[path.length - 1].x === size - 1 && path[path.length - 1].y === size - 1) {
          setGameWon(true);
        }
      }
    };
    animateSelection();
  };

  const resetGame = () => {
    setGameMode('player');
    setPlayerPosition({ x: 0, y: 0 });
    setAiPosition({ x: 0, y: 0 });
    setGameWon(false);
    setPlayerPaths([]);
    setCurrentPlayerPath([{ x: 0, y: 0 }]);
    setSelectedPath(null);
    setIsAIRunning(false);
    setAiStack([]);

    const newMaze = maze.map(row => row.map(cell => ({
      ...cell,
      visited: false,
      isPath: false,
      isBacktrack: false,
      isPlayerPath: false,
      pathNumber: undefined
    })));
    setMaze(newMaze);
  };

  const handleGenerateNewMaze = () => {
    resetGame();
    const newMaze = generateMaze();
    setMaze(newMaze);
  };

  useEffect(() => {
    const newMaze = generateMaze();
    setMaze(newMaze);
  }, [generateMaze]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simulador de Laberinto IA
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Encuentra el camino o mira cómo la IA lo resuelve con backtracking
          </p>
        </div>

        {/* Modern Controls */}
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
              onClick={resetGame}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Maze
            maze={maze}
            size={size}
            playerPosition={playerPosition}
            aiPosition={aiPosition}
            gameMode={gameMode}
            gameWon={gameWon}
          />

          {/* Sidebar */}
          <div className="space-y-6">
            <GameStatus
              gameMode={gameMode}
              playerPosition={playerPosition}
              aiPosition={aiPosition}
              gameWon={gameWon}
            />

            {playerPaths.length > 0 && (
              <PlayerPaths
                playerPaths={playerPaths}
                selectedPath={selectedPath}
                selectPath={selectPath}
              />
            )}

            {gameMode === 'ai' && (
              <AIStatus
                aiStack={aiStack}
                isAIRunning={isAIRunning}
              />
            )}

            <Instructions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeSimulator;