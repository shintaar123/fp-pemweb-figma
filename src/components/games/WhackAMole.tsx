import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';
import type { MathQuestion, GameSettings } from '../../App';

interface WhackAMoleProps {
  questions: MathQuestion[];
  onComplete: () => void;
  settings: GameSettings;
}

interface Mole {
  id: number;
  answer: number;
  isCorrect: boolean;
  isVisible: boolean;
}

export function WhackAMole({ questions, onComplete }: WhackAMoleProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const question = questions[currentQuestion];

  useEffect(() => {
    // Initialize moles
    const initialMoles: Mole[] = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      answer: 0,
      isCorrect: false,
      isVisible: false,
    }));
    setMoles(initialMoles);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    // Timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || !question) return;

    // Spawn moles randomly
    const spawnInterval = setInterval(() => {
      const visibleCount = moles.filter(m => m.isVisible).length;
      if (visibleCount < 3) {
        const availableHoles = moles.filter(m => !m.isVisible);
        if (availableHoles.length > 0) {
          const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
          const isCorrect = Math.random() > 0.5;
          
          const newAnswer = isCorrect 
            ? question.answer 
            : question.options?.[Math.floor(Math.random() * question.options.length)] || question.answer;

          setMoles(moles.map(m =>
            m.id === randomHole.id
              ? { ...m, answer: newAnswer, isCorrect, isVisible: true }
              : m
          ));

          // Hide mole after 1.5 seconds
          setTimeout(() => {
            setMoles(prevMoles =>
              prevMoles.map(m =>
                m.id === randomHole.id ? { ...m, isVisible: false } : m
              )
            );
          }, 1500);
        }
      }
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [moles, question, gameOver]);

  const handleWhack = (mole: Mole) => {
    if (!mole.isVisible || gameOver) return;

    if (mole.isCorrect) {
      setScore(score + 1);
      
      // Move to next question
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }

    // Hide the mole
    setMoles(moles.map(m =>
      m.id === mole.id ? { ...m, isVisible: false } : m
    ));
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-4">Time's Up!</h2>
          <div className="text-6xl mb-4">{score}</div>
          <p className="text-gray-600 mb-6">Correct whacks!</p>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-white mb-4">Whack-a-Mole</h2>
          <div className="bg-white rounded-2xl p-6 mb-4">
            <h3 className="mb-2">Find and whack:</h3>
            <div className="text-5xl">{question?.display} = ?</div>
          </div>
          <div className="flex justify-between text-white max-w-md mx-auto">
            <span className="text-2xl">Time: {timeLeft}s</span>
            <span className="text-2xl">Score: {score}</span>
          </div>
        </div>

        {/* Mole Grid */}
        <div className="grid grid-cols-3 gap-6">
          {moles.map((mole) => (
            <motion.div
              key={mole.id}
              className="aspect-square bg-gradient-to-br from-green-600 to-green-800 rounded-3xl shadow-xl overflow-hidden relative cursor-pointer border-4 border-green-900"
              onClick={() => handleWhack(mole)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Hole */}
              <div className="absolute inset-0 flex items-end justify-center pb-4">
                <div className="w-24 h-16 bg-black/50 rounded-t-full" />
              </div>

              {/* Mole */}
              <AnimatePresence>
                {mole.isVisible && (
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: '20%' }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="absolute inset-0 flex flex-col items-center justify-end pb-4"
                  >
                    {/* Mole Face */}
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl shadow-2xl ${
                      mole.isCorrect 
                        ? 'bg-gradient-to-br from-amber-600 to-amber-800' 
                        : 'bg-gradient-to-br from-gray-600 to-gray-800'
                    }`}>
                      <div className="text-center">
                        <div className="mb-2">
                          {mole.isCorrect ? '😊' : '😈'}
                        </div>
                        <div className="text-xl text-white">
                          {mole.answer}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
