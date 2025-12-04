import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Target } from 'lucide-react';
import type { MathQuestion, GameSettings } from '../../App';

interface AirplaneProps {
  questions: MathQuestion[];
  onComplete: () => void;
  settings: GameSettings;
}

interface Plane {
  id: string;
  answer: number;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
}

export function Airplane({ questions, onComplete }: AirplaneProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [shotPlane, setShotPlane] = useState<string | null>(null);
  const [bullets, setBullets] = useState<{ id: string; x: number; y: number }[]>([]);

  const question = questions[currentQuestion];

  useEffect(() => {
    if (!question) return;

    // Create planes for current question
    const newPlanes: Plane[] = question.options?.map((option, i) => ({
      id: `${currentQuestion}-${i}`,
      answer: option,
      isCorrect: option === question.answer,
      x: -20,
      y: 15 + (i * 20),
      speed: 0.3 + Math.random() * 0.2,
    })) || [];

    setPlanes(newPlanes);
  }, [currentQuestion, question]);

  useEffect(() => {
    if (showResult) return;

    // Animate planes flying
    const interval = setInterval(() => {
      setPlanes(prev =>
        prev.map(plane => ({
          ...plane,
          x: plane.x + plane.speed,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [showResult]);

  useEffect(() => {
    // Animate bullets
    const interval = setInterval(() => {
      setBullets(prev =>
        prev
          .map(bullet => ({
            ...bullet,
            x: bullet.x + 2,
          }))
          .filter(bullet => bullet.x < 120)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleShoot = (plane: Plane) => {
    if (shotPlane) return;

    // Create bullet
    const bulletId = `bullet-${Date.now()}`;
    setBullets([...bullets, { id: bulletId, x: 5, y: 50 }]);

    // Check if hit after animation
    setTimeout(() => {
      setShotPlane(plane.id);

      if (plane.isCorrect) {
        setScore(score + 1);
        
        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setShotPlane(null);
            setBullets([]);
          } else {
            setShowResult(true);
          }
        }, 1000);
      } else {
        setTimeout(() => {
          setShotPlane(null);
        }, 1000);
      }
    }, 500);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-4">Mission Complete! ✈️</h2>
          <div className="text-6xl mb-4">{score}/{questions.length}</div>
          <motion.button
            onClick={onComplete}
            className="w-full py-3 px-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 overflow-hidden relative">
      {/* Clouds */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-30"
            initial={{ x: `${i * 30}%`, y: `${i * 15}%` }}
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
          >
            ☁️
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-20 text-center pt-8 pb-4">
        <h2 className="text-white mb-4">Airplane Shooter</h2>
        <div className="bg-white rounded-2xl p-6 max-w-md mx-auto mb-4">
          <h3 className="mb-2">Shoot the plane with:</h3>
          <div className="text-5xl">{question?.display} = ?</div>
        </div>
        <div className="flex justify-center gap-8 text-white">
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
            Score: {score}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative h-96">
        {/* Cannon */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <Target className="w-16 h-16 text-white" />
            <div className="absolute top-1/2 left-full w-12 h-4 bg-gray-700 rounded-r-lg -translate-y-1/2" />
          </div>
        </div>

        {/* Bullets */}
        <AnimatePresence>
          {bullets.map((bullet) => (
            <motion.div
              key={bullet.id}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
              style={{
                left: `${bullet.x}%`,
                top: `${bullet.y}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            />
          ))}
        </AnimatePresence>

        {/* Planes */}
        <AnimatePresence>
          {planes.map((plane) => (
            <motion.div
              key={plane.id}
              className="absolute cursor-crosshair"
              style={{
                left: `${plane.x}%`,
                top: `${plane.y}%`,
              }}
              onClick={() => handleShoot(plane)}
              whileHover={{ scale: 1.1 }}
            >
              {shotPlane === plane.id ? (
                // Explosion
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 2, 0], opacity: [1, 1, 0] }}
                  className="text-6xl"
                >
                  💥
                </motion.div>
              ) : (
                // Flying plane
                <div className="relative">
                  {/* Plane body */}
                  <div className={`relative ${
                    plane.isCorrect 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    <svg width="80" height="60" viewBox="0 0 80 60" fill="currentColor">
                      {/* Plane shape */}
                      <ellipse cx="40" cy="30" rx="30" ry="12" />
                      <polygon points="10,30 25,20 25,40" />
                      <rect x="60" y="25" width="15" height="10" />
                      <polygon points="35,15 45,15 50,30 30,30" />
                      <circle cx="50" cy="30" r="4" fill="white" opacity="0.8" />
                    </svg>
                  </div>
                  
                  {/* Answer label */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-lg shadow-lg text-xl">
                    {plane.answer}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="text-center mt-8">
        <p className="text-white text-xl">Click on the plane with the correct answer!</p>
      </div>
    </div>
  );
}
