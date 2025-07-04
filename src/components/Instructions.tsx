export default function Instructions() {
    return (
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
    )
}