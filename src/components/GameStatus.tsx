import type { GameMode, Position } from "../types"

interface GameStatusProps {
    gameMode: GameMode
    playerPosition: Position
    aiPosition: Position
    gameWon: boolean
}

export default function GameStatus({ gameMode, playerPosition, aiPosition, gameWon }: GameStatusProps) {
    return (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Estado del Juego</h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Modo:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${gameMode === 'player' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
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
    )
}