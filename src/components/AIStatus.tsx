import type { Position } from "../types";

interface AIStatusProps {
    aiStack: Position[];
    isAIRunning: boolean;
}

export default function AIStatus({ aiStack, isAIRunning }: AIStatusProps) {
    return (
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
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${isAIRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {isAIRunning ? 'Ejecutándose' : 'Detenida'}
                    </span>
                </div>
            </div>
        </div>
    )
}