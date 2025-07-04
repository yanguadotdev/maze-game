import { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Eye, Users, Zap, Settings } from 'lucide-react';

// Tipos para el laberinto
type Cell = {
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

type Position = {
  x: number;
  y: number;
};

type GameMode = 'player' | 'ai';

const MazeSimulator = () => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [size] = useState(15);
  const [gameMode, setGameMode] = useState<GameMode>('player');
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [aiPosition, setAiPosition] = useState<Position>({ x: 0, y: 0 });
  const [isAIRunning, setIsAIRunning] = useState(false);
  const [aiStack, setAiStack] = useState<Position[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [playerPaths, setPlayerPaths] = useState<Position[][]>([]);
  const [currentPlayerPath, setCurrentPlayerPath] = useState<Position[]>([]);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);
  const [aiSpeed, setAiSpeed] = useState(100);
  const [showControls, setShowControls] = useState(true);

  // Generar laberinto usando algoritmo de backtracking
  const generateMaze = useCallback(() => {
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

    // Generar laberinto con backtracking
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
      } else if (stack.length > 0) {
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

    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
    setAiPosition({ x: 0, y: 0 });
    setGameWon(false);
    setPlayerPaths([]);
    setCurrentPlayerPath([{ x: 0, y: 0 }]);
    setSelectedPath(null);
    setAiStack([]);
  }, [size]);

  const getUnvisitedNeighbors = (pos: Position, maze: Cell[][]): Position[] => {
    const neighbors: Position[] = [];
    const { x, y } = pos;

    if (y > 0 && !maze[y - 1][x].visited) neighbors.push({ x, y: y - 1 });
    if (x < size - 1 && !maze[y][x + 1].visited) neighbors.push({ x: x + 1, y });
    if (y < size - 1 && !maze[y + 1][x].visited) neighbors.push({ x, y: y + 1 });
    if (x > 0 && !maze[y][x - 1].visited) neighbors.push({ x: x - 1, y });

    return neighbors;
  };

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
      setCurrentPlayerPath(prev => [...prev, newPos]);
      
      if (newPos.x === size - 1 && newPos.y === size - 1) {
        setGameWon(true);
      }
    }
  }, [playerPosition, gameMode, gameWon, isAIRunning, canMove, size]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

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

  const runAI = async () => {
    if (isAIRunning) return;
    
    setIsAIRunning(true);
    setGameMode('ai');
    setAiPosition({ x: 0, y: 0 });
    
    // Limpiar estados anteriores
    const newMaze = maze.map(row => row.map(cell => ({
      ...cell,
      visited: false,
      isPath: false,
      isBacktrack: false
    })));
    
    setMaze(newMaze);

    const stack: Position[] = [];
    let current: Position = { x: 0, y: 0 };
    const visited = new Set<string>();
    
    const posKey = (pos: Position) => `${pos.x},${pos.y}`;
    
    visited.add(posKey(current));
    stack.push(current);

    while (stack.length > 0) {
      const neighbors = getValidNeighbors(current, visited);
      
      if (neighbors.length > 0) {
        const next = neighbors[0]; // Tomar el primer vecino válido
        stack.push(next);
        visited.add(posKey(next));
        current = next;
        
        // Actualizar visualización
        setAiPosition(current);
        setAiStack([...stack]);
        
        const updatedMaze = newMaze.map(row => row.map(cell => ({
          ...cell,
          isPath: stack.some(pos => pos.x === cell.x && pos.y === cell.y),
          isBacktrack: false
        })));
        setMaze(updatedMaze);
        
        // Verificar si llegamos al final
        if (current.x === size - 1 && current.y === size - 1) {
          setGameWon(true);
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, aiSpeed));
      } else {
        // Backtrack
        stack.pop();
        if (stack.length > 0) {
          current = stack[stack.length - 1];
          setAiPosition(current);
          
          const updatedMaze = newMaze.map(row => row.map(cell => ({
            ...cell,
            isPath: stack.some(pos => pos.x === cell.x && pos.y === cell.y),
            isBacktrack: !stack.some(pos => pos.x === cell.x && pos.y === cell.y) && 
                         visited.has(posKey({ x: cell.x, y: cell.y }))
          })));
          setMaze(updatedMaze);
        }
        
        await new Promise(resolve => setTimeout(resolve, aiSpeed));
      }
    }
    
    setIsAIRunning(false);
  };

  const getValidNeighbors = (pos: Position, visited: Set<string>): Position[] => {
    const neighbors: Position[] = [];
    const { x, y } = pos;
    const posKey = (p: Position) => `${p.x},${p.y}`;

    const directions = [
      { x, y: y - 1 }, // up
      { x: x + 1, y }, // right
      { x, y: y + 1 }, // down
      { x: x - 1, y }  // left
    ];

    return directions.filter(next => 
      !visited.has(posKey(next)) && canMove(pos, next)
    );
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

  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  const getCellColor = (cell: Cell, x: number, y: number) => {
    const isCurrentPlayer = gameMode === 'player' && playerPosition.x === x && playerPosition.y === y;
    const isCurrentAI = gameMode === 'ai' && aiPosition.x === x && aiPosition.y === y;
    const isStart = x === 0 && y === 0;
    const isEnd = x === size - 1 && y === size - 1;
    
    if (isCurrentPlayer || isCurrentAI) return 'bg-blue-500';
    if (isStart) return 'bg-red-500';
    if (isEnd) return 'bg-green-500';
    if (cell.isPath) return 'bg-blue-200';
    if (cell.isBacktrack) return 'bg-red-200';
    if (cell.isPlayerPath) return 'bg-yellow-200';
    return 'bg-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ fontFamily: "'Work Sans', sans-serif" }}>
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
              onClick={() => setShowControls(!showControls)}
              className="flex items-center gap-3 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-300"
            >
              <Eye size={20} />
              {showControls ? 'Ocultar' : 'Mostrar'} Controles
            </button>
            
            {showControls && (
              <>
                <button
                  onClick={generateMaze}
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
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Maze */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
              <div className="grid gap-0 mx-auto" style={{ 
                gridTemplateColumns: `repeat(${size}, 1fr)`,
                maxWidth: '600px'
              }}>
                {maze.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`
                        relative w-8 h-8 ${getCellColor(cell, x, y)}
                        border-gray-800 transition-all duration-300
                        ${cell.walls.top ? 'border-t-2' : ''}
                        ${cell.walls.right ? 'border-r-2' : ''}
                        ${cell.walls.bottom ? 'border-b-2' : ''}
                        ${cell.walls.left ? 'border-l-2' : ''}
                      `}
                    >
                      {/* Player/AI Circle */}
                      {((gameMode === 'player' && playerPosition.x === x && playerPosition.y === y) ||
                        (gameMode === 'ai' && aiPosition.x === x && aiPosition.y === y)) && (
                        <div className="absolute inset-1 bg-blue-600 rounded-full shadow-lg z-10 transform transition-all duration-200 hover:scale-110" />
                      )}
                      
                      {/* Start/End markers */}
                      {x === 0 && y === 0 && (
                        <div className="absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                          1
                        </div>
                      )}
                      {x === size - 1 && y === size - 1 && (
                        <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                          ★
                        </div>
                      )}
                      
                      {/* Path numbers */}
                      {cell.pathNumber && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                          {cell.pathNumber}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Game Status */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Estado del Juego</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Modo:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    gameMode === 'player' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {gameMode === 'player' ? 'Jugador' : 'IA'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Posición:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded-lg">
                    {gameMode === 'player' 
                      ? `(${playerPosition.x}, ${playerPosition.y})`
                      : `(${aiPosition.x}, ${aiPosition.y})`
                    }
                  </span>
                </div>
                {gameWon && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-2xl text-center font-medium">
                    🎉 ¡Laberinto Completado!
                  </div>
                )}
              </div>
            </div>

            {/* Player Paths */}
            {playerPaths.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Paths del Jugador</h3>
                <div className="space-y-3">
                  {playerPaths.map((path, index) => (
                    <button
                      key={index}
                      onClick={() => selectPath(index)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border-2 ${
                        selectedPath === index
                          ? 'bg-blue-50 border-blue-300 shadow-md'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Path {index + 1}</span>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-lg">
                          {path.length} pasos
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Status */}
            {gameMode === 'ai' && (
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Estado de la IA</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Algoritmo:</span>
                    <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                      Backtracking
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Stack:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded-lg">
                      {aiStack.length} posiciones
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Estado:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isAIRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isAIRunning ? 'Ejecutándose' : 'Detenida'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instrucciones</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Inicio: Posición (0,0)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Meta: Esquina inferior derecha</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Jugador: Usar flechas del teclado</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">IA: Visualiza backtracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">Paths: Guarda múltiples intentos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeSimulator;