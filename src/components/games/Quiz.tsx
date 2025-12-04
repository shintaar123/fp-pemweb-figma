import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Trophy, ArrowRight } from 'lucide-react';
import type { MathQuestion, GameSettings } from '../../App';

interface QuizProps {
  questions: MathQuestion[];
  onComplete: () => void;
  settings: GameSettings;
}

export function Quiz({ questions, onComplete, settings }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswerClick = (answer: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === question.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="mb-4">Quiz Complete!</h2>
          <div className="text-6xl mb-4">
            {score}/{questions.length}
          </div>
          <p className="text-gray-600 mb-6">
            {score === questions.length ? 'Perfect score! 🎉' : 
             score >= questions.length * 0.7 ? 'Great job! 👏' : 
             'Keep practicing! 💪'}
          </p>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-white mb-2">
            <span>Question {currentQuestion + 1}/{questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-6xl mb-4">{question.display}</h2>
              <p className="text-gray-600">Select the correct answer</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {question.options?.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === question.answer;
                const showCorrect = selectedAnswer !== null && isCorrectAnswer;
                const showWrong = isSelected && !isCorrect;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerClick(option)}
                    disabled={selectedAnswer !== null}
                    className={`p-6 rounded-2xl text-2xl transition-all ${
                      showCorrect
                        ? 'bg-green-500 text-white'
                        : showWrong
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-gray-50 hover:bg-purple-50 border-2 border-gray-200'
                    }`}
                    whileHover={selectedAnswer === null ? { scale: 1.05 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.95 } : {}}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {option}
                      {showCorrect && <CheckCircle className="w-6 h-6" />}
                      {showWrong && <XCircle className="w-6 h-6" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={handleNext}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      Next Question <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      See Results <Trophy className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
