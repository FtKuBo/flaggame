import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Play, Settings, Trophy, Clock, Target, Zap, Info, X, Star } from 'lucide-react';

// Confetti component for celebration
const Confetti = ({ show }) => show ? (
  <div className="fixed inset-0 pointer-events-none z-50 animate-fade-in">
    {[...Array(80)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: `hsl(${Math.random() * 360}, 90%, 60%)`,
          opacity: 0.8,
          animation: `confetti-fall 1.5s ${Math.random()}s ease-out forwards`
        }}
      />
    ))}
  </div>
) : null;

const MentalGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, config, playing, gameOver
  const [level, setLevel] = useState('beginner');
  const [theme, setTheme] = useState('numbers');
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingSequence, setShowingSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameMessage, setGameMessage] = useState('');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('bestScore') || 0));
  const [bestLevel, setBestLevel] = useState(() => localStorage.getItem('bestLevel') || 'beginner');
  const [showConfetti, setShowConfetti] = useState(false);

  const levelOrder = ['beginner', 'intermediate', 'advanced'];
  const nextLevel = (current) => {
    const idx = levelOrder.indexOf(current);
    return idx < levelOrder.length - 1 ? levelOrder[idx + 1] : null;
  };

  const levels = {
    beginner: { sequenceLength: 3, showTime: 1500, inputTime: 5000 },
    intermediate: { sequenceLength: 5, showTime: 1200, inputTime: 4000 },
    advanced: { sequenceLength: 7, showTime: 1000, inputTime: 3000 }
  };

  const themes = {
    numbers: { items: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], colors: ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'] },
    colors: { items: ['Rouge', 'Bleu', 'Vert', 'Jaune', 'Violet', 'Rose', 'Orange', 'Cyan', 'Indigo'], colors: ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-cyan-500', 'bg-indigo-500'] },
    shapes: { items: ['●', '■', '▲', '♦', '★', '♠', '♥', '♣', '◆'], colors: ['bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-slate-600', 'bg-slate-700', 'bg-stone-600', 'bg-stone-700', 'bg-zinc-600', 'bg-zinc-700'] }
  };

  const generateSequence = useCallback(() => {
    const currentTheme = themes[theme];
    const sequenceLength = levels[level].sequenceLength;
    const newSequence = [];
    
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * currentTheme.items.length));
    }
    
    setSequence(newSequence);
  }, [level, theme]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setRound(1);
    setUserSequence([]);
    setCurrentIndex(0);
    generateSequence();
    showSequence();
  };

  const showSequence = () => {
    setShowingSequence(true);
    setGameMessage('Mémorisez la séquence...');
    
    setTimeout(() => {
      setShowingSequence(false);
      setTimeLeft(levels[level].inputTime);
      setGameMessage('Reproduisez la séquence !');
    }, levels[level].showTime * sequence.length);
  };

  useEffect(() => {
    if (gameState === 'playing' && !showingSequence && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 100);
      }, 100);
      return () => clearTimeout(timer);
    } else if (timeLeft <= 0 && gameState === 'playing' && !showingSequence) {
      endGame('Temps écoulé !');
    }
  }, [timeLeft, gameState, showingSequence]);

  const handleItemClick = (index) => {
    if (showingSequence || gameState !== 'playing') return;

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (sequence[currentIndex] === index) {
      if (currentIndex === sequence.length - 1) {
        // Séquence complète réussie
        const points = levels[level].sequenceLength * 10 + Math.floor(timeLeft / 100);
        setScore(score + points);
        setRound(round + 1);
        setCurrentIndex(0);
        setUserSequence([]);
        
        // Nouvelle séquence plus difficile
        generateSequence();
        setTimeout(() => showSequence(), 1000);
        setGameMessage(`Excellent ! +${points} points`);
      } else {
        setCurrentIndex(currentIndex + 1);
        setGameMessage(`Correct ! ${currentIndex + 2}/${sequence.length}`);
      }
    } else {
      endGame('Erreur dans la séquence !');
    }
  };

  const endGame = (message) => {
    setGameState('gameOver');
    setGameMessage(message);
  };

  const resetGame = () => {
    setGameState('menu');
    setGameMessage('');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      generateSequence();
    }
  }, [gameState, generateSequence]);

  // Save best score/level
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('bestScore', score);
    }
    if (levelOrder.indexOf(level) > levelOrder.indexOf(bestLevel)) {
      setBestLevel(level);
      localStorage.setItem('bestLevel', level);
    }
  }, [score, level]);

  // Level up logic: every 3 rounds, go to next level
  useEffect(() => {
    if (round > 1 && round % 3 === 1 && level !== 'advanced') {
      const next = nextLevel(level);
      if (next) {
        setLevel(next);
        setShowConfetti(true);
        setGameMessage(`Niveau supérieur ! Bien joué !`);
        setTimeout(() => setShowConfetti(false), 1800);
      }
    }
  }, [round]);

  const MenuScreen = () => (
    <div className="text-center space-y-8">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <Brain className="w-12 h-12 text-purple-600 animate-bounce" />
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 drop-shadow-lg">MentalGame</h1>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-200 to-pink-200 px-4 py-2 rounded-xl shadow">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-lg">Meilleur score: <span className="text-pink-600">{bestScore}</span></span>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-200 to-green-200 px-4 py-2 rounded-xl shadow">
          <Star className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-lg">Niveau max: <span className="capitalize text-green-600">{bestLevel}</span></span>
        </div>
      </div>
      <p className="text-lg text-gray-600 max-w-md mx-auto">
        Testez votre mémoire séquentielle et votre attention !<br />
        <span className="font-semibold text-purple-600">Jusqu'où irez-vous ?</span>
      </p>
      <div className="space-y-4">
        <button
          onClick={() => setShowHowToPlay(true)}
          className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors mx-auto shadow-md"
        >
          <Info className="w-5 h-5" />
          <span>Comment jouer ?</span>
        </button>
        <button
          onClick={() => setGameState('config')}
          className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors mx-auto shadow-lg"
        >
          <Settings className="w-5 h-5" />
          <span>Configuration</span>
        </button>
        <button
          onClick={startGame}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-green-500 hover:to-blue-600 transition-transform transform hover:scale-105 mx-auto shadow-xl"
        >
          <Play className="w-5 h-5" />
          <span className="text-lg font-bold">Jouer Maintenant</span>
        </button>
      </div>
      {showHowToPlay && <HowToPlayModal />}
    </div>
  );

  const ConfigScreen = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-gray-800">Configuration du Jeu</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Niveau de Difficulté</label>
          <div className="space-y-2">
            {Object.entries(levels).map(([key, config]) => (
              <label key={key} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="level"
                  value={key}
                  checked={level === key}
                  onChange={(e) => setLevel(e.target.value)}
                  className="form-radio h-5 w-5 text-purple-600 bg-gray-200 border-gray-300 focus:ring-purple-500"
                />
                <span className="capitalize font-medium text-gray-800">{key}</span>
                <span className="text-sm text-gray-500">
                  ({config.sequenceLength} items, {config.inputTime/1000}s)
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Thème</label>
          <div className="space-y-2">
            {Object.keys(themes).map((themeKey) => (
              <label key={themeKey} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value={themeKey}
                  checked={theme === themeKey}
                  onChange={(e) => setTheme(e.target.value)}
                  className="form-radio h-5 w-5 text-purple-600 bg-gray-200 border-gray-300 focus:ring-purple-500"
                />
                <span className="capitalize font-medium text-gray-800">{themeKey}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setGameState('menu')}
        className="mt-8 w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-md"
      >
        Retour au Menu
      </button>
    </div>
  );

  const GameScreen = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4 text-lg">
        <div className="font-bold text-purple-700">Score: <span className="text-2xl">{score}</span></div>
        <div className="font-bold text-gray-600">Round: {round}</div>
      </div>

      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4 shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-100"
          style={{ width: `${(timeLeft / levels[level].inputTime) * 100}%` }}
        ></div>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-xl font-semibold text-gray-800 animate-pulse">{gameMessage}</p>
      </div>

      <div className={`grid grid-cols-3 gap-4 transition-opacity duration-300 ${showingSequence ? 'opacity-30' : 'opacity-100'}`}>
        {themes[theme].items.map((item, index) => {
          const isVisible = showingSequence && sequence[currentIndex] === index && sequence.length > currentIndex;

          return (
            <button
              key={index}
              onClick={() => handleItemClick(index)}
              disabled={showingSequence}
              className={`h-28 md:h-32 rounded-xl text-white text-3xl font-bold flex items-center justify-center
                transition-all duration-200 transform hover:scale-105 shadow-lg
                ${themes[theme].colors[index]} 
                ${isVisible ? 'scale-110 ring-4 ring-white' : ''}
                ${!showingSequence ? 'cursor-pointer hover:shadow-2xl' : 'cursor-wait'}`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <Confetti show={showConfetti} />
    </div>
  );

  const GameOverScreen = () => (
    <div className="text-center space-y-6">
      <Trophy className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
      <h2 className="text-3xl font-bold text-gray-800">Partie Terminée</h2>
      <p className="text-xl text-red-600 font-semibold">{gameMessage}</p>
      <div className="text-2xl font-bold text-purple-700">
        Score Final: <span className="text-4xl">{score}</span>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetGame}
          className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
        >
          Menu Principal
        </button>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-green-500 hover:to-blue-600 transition-transform transform hover:scale-105 shadow-xl"
        >
          Rejouer
        </button>
      </div>
    </div>
  );

  const HowToPlayModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative shadow-2xl space-y-6">
        <h3 className="text-2xl font-bold text-gray-800">Comment Jouer</h3>
        <ul className="space-y-3 text-left text-gray-600">
          <li className="flex items-start"><span className="mr-2 text-purple-500 font-bold">1.</span>Mémorisez la séquence d'éléments qui s'affiche.</li>
          <li className="flex items-start"><span className="mr-2 text-purple-500 font-bold">2.</span>Reproduisez la séquence en cliquant sur les éléments dans le bon ordre.</li>
          <li className="flex items-start"><span className="mr-2 text-purple-500 font-bold">3.</span>La séquence s'allonge et le temps diminue à chaque niveau !</li>
          <li className="flex items-start"><span className="mr-2 text-purple-500 font-bold">4.</span>Atteignez le meilleur score et devenez le maître du jeu !</li>
        </ul>
        <button 
          onClick={() => setShowHowToPlay(false)} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6"/>
        </button>
      </div>
    </div>
  );

  const renderGameState = () => {
    switch (gameState) {
      case 'config':
        return <ConfigScreen />;
      case 'playing':
        return <GameScreen />;
      case 'gameOver':
        return <GameOverScreen />;
      case 'menu':
      default:
        return <MenuScreen />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {renderGameState()}
      </div>
    </div>
  );
};

export default MentalGame; 
