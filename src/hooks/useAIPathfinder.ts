import { useRef, useState } from 'react'
import type { Cell, Position } from '../types'
import { canMove } from '../utils/mazeUtils'

interface UseAIPathfinderOptions {
  maze: Cell[][]
  size: number
  aiSpeed: number
  onFinish?: () => void
  updateMaze: (updatedMaze: Cell[][]) => void
}

export function useAIPathfinder({
  maze,
  size,
  aiSpeed,
  onFinish,
  updateMaze,
}: UseAIPathfinderOptions) {
  const [isAIRunning, setIsAIRunning] = useState(false)
  const [aiPosition, setAiPosition] = useState<Position>({ x: 0, y: 0 })
  const [aiStack, setAiStack] = useState<Position[]>([])
  const currentCancelRef = useRef<(() => void) | null>(null)

  const getValidNeighbors = (pos: Position, visited: Set<string>): Position[] => {
    const { x, y } = pos
    const posKey = (p: Position) => `${p.x},${p.y}`

    const directions = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y }
    ]

    return directions.filter(next =>
      !visited.has(posKey(next)) && canMove(pos, next, maze, size)
    )
  }

  const runAI = async () => {
    if (isAIRunning) return

    setIsAIRunning(true)

    let cancelled = false
    currentCancelRef.current = () => {
      cancelled = true;
    }

    setAiPosition({ x: 0, y: 0 })

    const newMaze = maze.map(row => row.map(cell => ({
      ...cell,
      visited: false,
      isPath: false,
      isBacktrack: false,
    })))

    const stack: Position[] = []
    let current: Position = { x: 0, y: 0 }
    const visited = new Set<string>()

    const posKey = (pos: Position) => `${pos.x},${pos.y}`

    visited.add(posKey(current))
    stack.push(current)

    while (stack.length > 0 && !cancelled) {
      const neighbors = getValidNeighbors(current, visited)

      if (neighbors.length > 0) {
        const next = neighbors[0]
        stack.push(next)
        visited.add(posKey(next))
        current = next

        setAiPosition(current)
        setAiStack([...stack])

        const updatedMaze = newMaze.map(row => row.map(cell => ({
          ...cell,
          isPath: stack.some(pos => pos.x === cell.x && pos.y === cell.y),
          isBacktrack: false,
        })))
        updateMaze(updatedMaze)

        if (current.x === size - 1 && current.y === size - 1) {
          onFinish?.()
          break
        }

        await new Promise(resolve => setTimeout(resolve, aiSpeed))
      } else {
        stack.pop()
        if (stack.length > 0) {
          current = stack[stack.length - 1]
          setAiPosition(current)

          const updatedMaze = newMaze.map(row => row.map(cell => ({
            ...cell,
            isPath: stack.some(pos => pos.x === cell.x && pos.y === cell.y),
            isBacktrack: !stack.some(pos => pos.x === cell.x && pos.y === cell.y) &&
              visited.has(posKey({ x: cell.x, y: cell.y }))
          })))
          updateMaze(updatedMaze)
        }

        await new Promise(resolve => setTimeout(resolve, aiSpeed))
      }
    }

    setIsAIRunning(false)
  }

  const resetAI = () => {
    setAiPosition({ x: 0, y: 0 })
    setAiStack([])
    setIsAIRunning(false)
  }

  return {
    runAI,
    isAIRunning,
    aiPosition,
    aiStack,
    setAiPosition,
    setAiStack,
    setIsAIRunning,
    resetAI,
    cancelAI: () => {
      currentCancelRef.current?.();
    }
  }
}
