import { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Settings, Play, ArrowLeft } from 'lucide-react';
import { MathGenerator } from './components/MathGenerator';
import { Quiz } from './components/games/Quiz';
import { MatchUp } from './components/games/MatchUp';
import { TrueOrFalse } from './components/games/TrueOrFalse';
import { FindTheMatch } from './components/games/FindTheMatch';
import { WhackAMole } from './components/games/WhackAMole';
import { GameshowQuiz } from './components/games/GameshowQuiz';
import { BalloonPop } from './components/games/BalloonPop';
import { MazeChase } from './components/games/MazeChase';
import { RankOrder } from './components/games/RankOrder';
import { Airplane } from './components/games/Airplane';

export interface MathQuestion {
  question: string;
  answer: number;
  options?: number[];
  display: string;
}

export interface GameSettings {
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  minNumber: number;
  maxNumber: number;
  questionCount: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'generator' | 'playing'>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    operation: 'addition',
    minNumber: 1,
    maxNumber: 10,
    questionCount: 10,
  });

  const gameTemplates = [
    { id: 'quiz', name: 'Quiz', icon: '📝', description: 'Standard quiz format', color: 'from-blue-500 to-purple-600' },
    { id: 'matchup', name: 'Match up', icon: '🔗', description: 'Matching pairs game', color: 'from-green-500 to-teal-600' },
    { id: 'truefalse', name: 'True or false', icon: '✓✗', description: 'Binary choice questions', color: 'from-orange-500 to-red-600' },
    { id: 'findmatch', name: 'Find the match', icon: '🎴', description: 'Memory card game', color: 'from-pink-500 to-rose-600' },
    { id: 'whackamole', name: 'Whack-a-mole', icon: '🔨', description: 'Interactive whack game', color: 'from-yellow-500 to-orange-600' },
    { id: 'gameshow', name: 'Gameshow quiz', icon: '📺', description: 'TV-style gameshow', color: 'from-purple-500 to-indigo-600' },
    { id: 'balloon', name: 'Balloon pop', icon: '🎈', description: 'Pop balloons game', color: 'from-cyan-500 to-blue-600' },
    { id: 'maze', name: 'Maze chase', icon: '🏃', description: 'Maze navigation game', color: 'from-emerald-500 to-green-600' },
    { id: 'rankorder', name: 'Rank order', icon: '📊', description: 'Ordering items game', color: 'from-violet-500 to-purple-600' },
    { id: 'airplane', name: 'Airplane', icon: '✈️', description: 'Flying game format', color: 'from-sky-500 to-blue-600' },
  ];

  const handleStartGame = (template: string) => {
    setSelectedTemplate(template);
    setCurrentScreen('generator');
  };

  const handlePlayGame = (generatedQuestions: MathQuestion[], settings: GameSettings) => {
    setQuestions(generatedQuestions);
    setGameSettings(settings);
    setCurrentScreen('playing');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedTemplate(null);
    setQuestions([]);
  };

  const handleBackToGenerator = () => {
    setCurrentScreen('generator');
  };

  const renderGame = () => {
    const commonProps = { questions, onComplete: handleBackToGenerator, settings: gameSettings };
    
    switch (selectedTemplate) {
      case 'quiz':
        return <Quiz {...commonProps} />;
      case 'matchup':
        return <MatchUp {...commonProps} />;
      case 'truefalse':
        return <TrueOrFalse {...commonProps} />;
      case 'findmatch':
        return <FindTheMatch {...commonProps} />;
      case 'whackamole':
        return <WhackAMole {...commonProps} />;
      case 'gameshow':
        return <GameshowQuiz {...commonProps} />;
      case 'balloon':
        return <BalloonPop {...commonProps} />;
      case 'maze':
        return <MazeChase {...commonProps} />;
      case 'rankorder':
        return <RankOrder {...commonProps} />;
      case 'airplane':
        return <Airplane {...commonProps} />;
      default:
        return null;
    }
  };

  if (currentScreen === 'playing') {
    return renderGame();
  }

  if (currentScreen === 'generator') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <motion.button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Templates
          </motion.button>
          
          <MathGenerator
            templateName={gameTemplates.find(t => t.id === selectedTemplate)?.name || ''}
            onPlay={handlePlayGame}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Math Quiz Generator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create engaging math games with beautiful interactive templates. Choose from 10 different game modes!
          </p>
        </motion.div>

        {/* Game Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {gameTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => handleStartGame(template.id)}
              >
                <div className={`h-32 bg-gradient-to-br ${template.color} flex items-center justify-center relative overflow-hidden`}>
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
                  />
                  <span className="text-6xl filter drop-shadow-lg">{template.icon}</span>
                </div>
                <div className="p-4">
                  <h3 className="mb-1">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-2 px-4 bg-gradient-to-r ${template.color} text-white rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow`}
                  >
                    <Play className="w-4 h-4" />
                    Create
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2">Customizable</h3>
            <p className="text-gray-600 text-sm">Adjust difficulty, operations, and number ranges</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2">Interactive</h3>
            <p className="text-gray-600 text-sm">Engaging gameplay with smooth animations</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2">Educational</h3>
            <p className="text-gray-600 text-sm">Learn math while having fun with games</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
