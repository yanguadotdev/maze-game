import type { Position } from "../types"

interface PlayerPathsProps {
    playerPaths: Position[][]
    selectedPath: number | null
    selectPath: (pathIndex: number) => void
}


export default function PlayerPaths({ playerPaths, selectedPath, selectPath }: PlayerPathsProps) {
    return (
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Paths del Jugador</h3>
            <div className="space-y-3">
                {playerPaths.map((path, index) => (
                    <button
                        key={index}
                        onClick={() => selectPath(index)}
                        className={`w-full text-left p-4 rounded-2xl transition-all duration-200 border-2 ${selectedPath === index
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
    )
}