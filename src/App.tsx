import { useState, useEffect } from 'react'
import Maze from './components/Maze'
import type { Cell } from './types'
import GameStatus from './components/GameStatus'
import PlayerPaths from './components/PlayerPaths'
import AIStatus from './components/AIStatus'
import Instructions from './components/Instructions'
import { useMazeGenerator } from './hooks/useMazeGenerator'
import { useAIPathfinder } from './hooks/useAIPathfinder'
import { usePlayerMovement } from './hooks/usePlayerMovement'
import { usePlayerPaths } from './hooks/usePlayerPaths'
import { useGameState } from './hooks/useGameState'
import Controls from './components/Controls'


const MazeSimulator = () => {
  const [maze, setMaze] = useState<Cell[][]>([])

  const {
    gameMode,
    setGameMode,
    gameWon,
    setGameWon,
    aiSpeed,
    setAiSpeed,
    playerPosition,
    setPlayerPosition,
    resetGameState,
    size
  } = useGameState()

  const { generateMaze } = useMazeGenerator(size)
  const {
    runAI,
    isAIRunning,
    aiPosition,
    aiStack,
    resetAI,
    cancelAI
  } = useAIPathfinder({
    maze,
    size,
    aiSpeed,
    onFinish: () => setGameWon(true),
    updateMaze: setMaze
  })

  const {
    playerPaths,
    currentPlayerPath,
    setCurrentPlayerPath,
    selectedPath,
    savePlayerPath,
    selectPath,
    resetPaths
  } = usePlayerPaths({
    size,
    setPlayerPosition,
    setGameWon,
    maze,
    setMaze
  })


  usePlayerMovement({
    isAIRunning,
    gameMode,
    gameWon,
    playerPosition,
    setPlayerPosition,
    currentPlayerPath,
    setCurrentPlayerPath,
    maze,
    size,
    onWin: () => setGameWon(true)
  })

  const handleResetGame = () => {
    resetGameState()
    resetPaths()
    resetAI()
    cancelAI()

    const newMaze = maze.map(row => row.map(cell => ({
      ...cell,
      visited: false,
      isPath: false,
      isBacktrack: false,
      isPlayerPath: false,
      pathNumber: undefined
    })))
    setMaze(newMaze)
  }

  const handleGenerateNewMaze = () => {
    handleResetGame()
    const newMaze = generateMaze()
    setMaze(newMaze)
  }

  useEffect(() => {
    const newMaze = generateMaze()
    setMaze(newMaze)
  }, [generateMaze])

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

        <Controls
          gameMode={gameMode}
          setGameMode={setGameMode}
          handleGenerateNewMaze={handleGenerateNewMaze}
          handleResetGame={handleResetGame}
          runAI={runAI}
          isAIRunning={isAIRunning}
          savePlayerPath={savePlayerPath}
          aiSpeed={aiSpeed}
          setAiSpeed={setAiSpeed}
        />
        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Maze
            maze={maze}
            size={size}
            playerPosition={playerPosition}
            aiPosition={aiPosition}
            gameMode={gameMode}
            gameWon={gameWon}
          />

          {/* SIDEBAR */}
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
  )
}

export default MazeSimulator