import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import type { MathQuestion, GameSettings } from '../../App';

interface TrueOrFalseProps {
  questions: MathQuestion[];
  onComplete: () => void;
  settings: GameSettings;
}

interface TFQuestion {
  equation: string;
  isCorrect: boolean;
  correctAnswer: number;
  shownAnswer: number;
}

export function TrueOrFalse({ questions, onComplete }: TrueOrFalseProps) {
  const [tfQuestions] = useState<TFQuestion[]>(() => {
    return questions.map(q => {
      const isCorrect = Math.random() > 0.5;
      const shownAnswer = isCorrect 
        ? q.answer 
        : q.answer + (Math.floor(Math.random() * 6) - 3);
      
      return {
        equation: `${q.display} = ${shownAnswer}`,
        isCorrect,
        correctAnswer: q.answer,
        shownAnswer,
      };
    });
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = tfQuestions[currentQuestion];

  const handleAnswer = (answer: boolean) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    if (answer === question.isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < tfQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-4">Game Complete!</h2>
          <div className="text-6xl mb-4">
            {score}/{tfQuestions.length}
          </div>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-white mb-2">
            <span>Question {currentQuestion + 1}/{tfQuestions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / tfQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-3xl p-12 shadow-2xl text-center"
          >
            <h3 className="text-gray-600 mb-4">Is this equation correct?</h3>
            <div className="text-7xl mb-12">{question.equation}</div>

            <div className="grid grid-cols-2 gap-6">
              <motion.button
                onClick={() => handleAnswer(true)}
                disabled={selectedAnswer !== null}
                className={`p-8 rounded-2xl text-2xl transition-all ${
                  selectedAnswer === true
                    ? question.isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-green-100 hover:bg-green-200 text-green-700 border-2 border-green-300'
                }`}
                whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
              >
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle className="w-12 h-12" />
                  <span>TRUE</span>
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleAnswer(false)}
                disabled={selectedAnswer !== null}
                className={`p-8 rounded-2xl text-2xl transition-all ${
                  selectedAnswer === false
                    ? !question.isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300'
                }`}
                whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
              >
                <div className="flex flex-col items-center gap-3">
                  <XCircle className="w-12 h-12" />
                  <span>FALSE</span>
                </div>
              </motion.button>
            </div>

            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                {selectedAnswer === question.isCorrect ? (
                  <div className="text-green-600 text-xl">✓ Correct!</div>
                ) : (
                  <div className="text-red-600 text-xl">
                    ✗ Wrong! The correct answer is {question.correctAnswer}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
