import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import type { MathQuestion, GameSettings } from '../../App';

interface MazeChaseProps {
  questions: MathQuestion[];
  onComplete: () => void;
  settings: GameSettings;
}

interface Position {
  x: number;
  y: number;
}

export function MazeChase({ questions, onComplete }: MazeChaseProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 0, y: 0 });
  const [collected, setCollected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [itemPositions, setItemPositions] = useState<Position[]>([]);

  const question = questions[currentQuestion];
  const gridSize = 6;

  useEffect(() => {
    // Reset player position
    setPlayerPos({ x: 0, y: 0 });
    setCollected([]);

    // Generate random positions for items
    const positions: Position[] = [];
    question.options?.forEach((_, i) => {
      let pos: Position;
      do {
        pos = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        };
      } while (
        positions.some(p => p.x === pos.x && p.y === pos.y) ||
        (pos.x === 0 && pos.y === 0)
      );
      positions.push(pos);
    });
    setItemPositions(positions);
  }, [currentQuestion, question]);

  const movePlayer = (dx: number, dy: number) => {
    const newPos = {
      x: Math.max(0, Math.min(gridSize - 1, playerPos.x + dx)),
      y: Math.max(0, Math.min(gridSize - 1, playerPos.y + dy)),
    };
    setPlayerPos(newPos);

    // Check if player collected an item
    itemPositions.forEach((pos, i) => {
      if (pos.x === newPos.x && pos.y === newPos.y && !collected.includes(i)) {
        setCollected([...collected, i]);
        
        const answer = question.options?.[i];
        if (answer === question.answer) {
          setScore(score + 1);
          
          setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
            } else {
              setShowResult(true);
            }
          }, 1000);
        }
      }
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPos, collected]);

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-4">Maze Complete!</h2>
          <div className="text-6xl mb-4">{score}/{questions.length}</div>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Generator
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-white mb-4">Maze Chase</h2>
          <div className="bg-white rounded-2xl p-6 mb-4">
            <h3 className="mb-2">Find the correct answer:</h3>
            <div className="text-5xl">{question?.display} = ?</div>
          </div>
          <div className="flex justify-center gap-8 text-white mb-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              Question {currentQuestion + 1}/{questions.length}
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              Score: {score}
            </div>
          </div>
          <p className="text-white/90">Use arrow keys or buttons to move</p>
        </div>

        {/* Maze Grid */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
              const x = i % gridSize;
              const y = Math.floor(i / gridSize);
              const isPlayer = playerPos.x === x && playerPos.y === y;
              const itemIndex = itemPositions.findIndex(pos => pos.x === x && pos.y === y);
              const hasItem = itemIndex !== -1 && !collected.includes(itemIndex);
              const isCollected = itemIndex !== -1 && collected.includes(itemIndex);

              return (
                <motion.div
                  key={i}
                  className={`aspect-square rounded-xl border-2 flex items-center justify-center text-2xl ${
                    isPlayer
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300'
                      : isCollected
                      ? 'bg-gray-100 border-gray-200'
                      : hasItem
                      ? 'bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-500'
                      : 'bg-gradient-to-br from-green-100 to-green-200 border-green-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {isPlayer && '🏃'}
                  {hasItem && (
                    <div className="text-center">
                      <div className="text-xl">{question.options?.[itemIndex]}</div>
                    </div>
                  )}
                  {isCollected && '✓'}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-2">
            <div />
            <motion.button
              onClick={() => movePlayer(0, -1)}
              className="p-4 bg-white rounded-xl shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUp className="w-8 h-8 text-green-600" />
            </motion.button>
            <div />
            
            <motion.button
              onClick={() => movePlayer(-1, 0)}
              className="p-4 bg-white rounded-xl shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-8 h-8 text-green-600" />
            </motion.button>
            <motion.button
              onClick={() => movePlayer(0, 1)}
              className="p-4 bg-white rounded-xl shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowDown className="w-8 h-8 text-green-600" />
            </motion.button>
            <motion.button
              onClick={() => movePlayer(1, 0)}
              className="p-4 bg-white rounded-xl shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowRight className="w-8 h-8 text-green-600" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
