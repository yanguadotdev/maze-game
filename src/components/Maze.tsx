import type { Cell, GameMode, Position } from "../types"

interface MazeProps {
    maze: Cell[][]
    size: number
    playerPosition: Position
    aiPosition: Position
    gameMode: GameMode
    gameWon: boolean
}

export default function Maze({
    maze,
    size,
    playerPosition,
    aiPosition,
    gameMode,
}: MazeProps) {


    const getCellColor = (cell: Cell, x: number, y: number) => {
        const isCurrentPlayer = gameMode === 'player' && playerPosition.x === x && playerPosition.y === y
        const isCurrentAI = gameMode === 'ai' && aiPosition.x === x && aiPosition.y === y
        const isStart = x === 0 && y === 0
        const isEnd = x === size - 1 && y === size - 1

        if (isCurrentPlayer || isCurrentAI) return 'bg-blue-400'
        if (isStart) return 'bg-red-500'
        if (isEnd) return 'bg-green-500'
        if (cell.isPath) return 'bg-blue-200'
        if (cell.isBacktrack) return 'bg-red-200'
        if (cell.isPlayerPath) return 'bg-yellow-200'
        return 'bg-white'
    }

    return (
        <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
                <div className="grid gap-0 mx-auto" style={{
                    gridTemplateColumns: `repeat(${size}, 1fr)`,
                    maxWidth: '800px'
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
                                    <div className="absolute top-0 left-0 size-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                                        1
                                    </div>
                                )}
                                {x === size - 1 && y === size - 1 && (
                                    <div className="absolute top-0 right-0 size-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
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
    )
}