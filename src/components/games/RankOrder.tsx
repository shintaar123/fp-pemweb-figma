import { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { Trophy, GripVertical, CheckCircle } from 'lucide-react';
import type { MathQuestion, GameSettings } from '../../App';

interface RankOrderProps {
  questions: MathQuestion[];
  onComplete: () => void;
  settings: GameSettings;
}

interface RankItem {
  id: string;
  display: string;
  value: number;
}

export function RankOrder({ questions, onComplete }: RankOrderProps) {
  const [items, setItems] = useState<RankItem[]>(() => {
    const rankItems = questions.slice(0, 6).map((q, i) => ({
      id: `item-${i}`,
      display: q.display,
      value: q.answer,
    }));
    
    // Shuffle items
    return [...rankItems].sort(() => Math.random() - 0.5);
  });

  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const correctOrder = [...items].sort((a, b) => a.value - b.value);

  const handleCheck = () => {
    const correct = items.every((item, i) => item.id === correctOrder[i].id);
    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setTimeout(() => {
        setShowResult(true);
      }, 2000);
    }
  };

  const handleTryAgain = () => {
    setIsChecked(false);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-4">Perfect Order! 🎉</h2>
          <p className="text-gray-600 mb-6">You sorted all equations correctly!</p>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-white mb-4">Rank Order</h2>
          <p className="text-white/90 text-xl">
            Drag and arrange the equations from smallest to largest
          </p>
        </div>

        {/* Ranking Area */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full" />
            <span className="text-gray-600">Smallest → Largest</span>
          </div>

          <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
            {items.map((item, index) => {
              const correctIndex = correctOrder.findIndex(c => c.id === item.id);
              const isInCorrectPosition = isChecked && correctIndex === index;
              const isInWrongPosition = isChecked && correctIndex !== index;

              return (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    isInCorrectPosition
                      ? 'bg-green-100 border-green-500'
                      : isInWrongPosition
                      ? 'bg-red-100 border-red-500'
                      : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-purple-400'
                  }`}
                  whileHover={!isChecked ? { scale: 1.02 } : {}}
                  whileDrag={{ scale: 1.05, zIndex: 1 }}
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className={`w-6 h-6 ${isChecked ? 'text-gray-400' : 'text-purple-400 cursor-grab active:cursor-grabbing'}`} />
                    
                    <div className="flex-1">
                      <div className="text-3xl">
                        {item.display} = {item.value}
                      </div>
                    </div>

                    {isInCorrectPosition && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </motion.div>
                    )}

                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      isInCorrectPosition
                        ? 'bg-green-500 text-white'
                        : isInWrongPosition
                        ? 'bg-red-500 text-white'
                        : 'bg-purple-200 text-purple-700'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>

        {/* Check Button */}
        {!isChecked ? (
          <motion.button
            onClick={handleCheck}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-xl shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Check My Order
          </motion.button>
        ) : !isCorrect ? (
          <motion.button
            onClick={handleTryAgain}
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl text-xl shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Again
          </motion.button>
        ) : null}

        {/* Feedback */}
        {isChecked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-6 rounded-2xl text-center text-xl ${
              isCorrect
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isCorrect ? (
              <>✓ Perfect! All equations are in the correct order!</>
            ) : (
              <>✗ Not quite right. Try rearranging the equations!</>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
