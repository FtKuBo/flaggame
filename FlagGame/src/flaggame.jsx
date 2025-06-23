import React, { useState, useEffect, useCallback } from 'react';
import { Flag, Settings, Play, Trophy, Moon, Sun, Info, X, Star } from 'lucide-react';

const FlagGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, config, playing, gameOver, win
  const [darkMode, setDarkMode] = useState(false);
  const [currentFlag, setCurrentFlag] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem('flagGameBestScore') || 0));
  const [bestStreak, setBestStreak] = useState(() => Number(localStorage.getItem('flagGameBestStreak') || 0));
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  // Flag data - 100 countries with their flags and names
  const flagData = [
    { name: 'Afghanistan', flag: '🇦🇫' },
    { name: 'Albania', flag: '🇦🇱' },
    { name: 'Algeria', flag: '🇩🇿' },
    { name: 'Argentina', flag: '🇦🇷' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Austria', flag: '🇦🇹' },
    { name: 'Belgium', flag: '🇧🇪' },
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'Bulgaria', flag: '🇧🇬' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'Chile', flag: '🇨🇱' },
    { name: 'China', flag: '🇨🇳' },
    { name: 'Colombia', flag: '🇨🇴' },
    { name: 'Croatia', flag: '🇭🇷' },
    { name: 'Cuba', flag: '🇨🇺' },
    { name: 'Czech Republic', flag: '🇨🇿' },
    { name: 'Denmark', flag: '🇩🇰' },
    { name: 'Egypt', flag: '🇪🇬' },
    { name: 'Estonia', flag: '🇪🇪' },
    { name: 'Finland', flag: '🇫🇮' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'Greece', flag: '🇬🇷' },
    { name: 'Hungary', flag: '🇭🇺' },
    { name: 'Iceland', flag: '🇮🇸' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'Indonesia', flag: '🇮🇩' },
    { name: 'Iran', flag: '🇮🇷' },
    { name: 'Iraq', flag: '🇮🇶' },
    { name: 'Ireland', flag: '🇮🇪' },
    { name: 'Israel', flag: '🇮🇱' },
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'Jordan', flag: '🇯🇴' },
    { name: 'Kazakhstan', flag: '🇰🇿' },
    { name: 'Kenya', flag: '🇰🇪' },
    { name: 'Kuwait', flag: '🇰🇼' },
    { name: 'Latvia', flag: '🇱🇻' },
    { name: 'Lebanon', flag: '🇱🇧' },
    { name: 'Libya', flag: '🇱🇾' },
    { name: 'Lithuania', flag: '🇱🇹' },
    { name: 'Luxembourg', flag: '🇱🇺' },
    { name: 'Malaysia', flag: '🇲🇾' },
    { name: 'Maldives', flag: '🇲🇻' },
    { name: 'Malta', flag: '🇲🇹' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'Monaco', flag: '🇲🇨' },
    { name: 'Mongolia', flag: '🇲🇳' },
    { name: 'Morocco', flag: '🇲🇦' },
    { name: 'Netherlands', flag: '🇳🇱' },
    { name: 'New Zealand', flag: '🇳🇿' },
    { name: 'Nigeria', flag: '🇳🇬' },
    { name: 'North Korea', flag: '🇰🇵' },
    { name: 'Norway', flag: '🇳🇴' },
    { name: 'Pakistan', flag: '🇵🇰' },
    { name: 'Panama', flag: '🇵🇦' },
    { name: 'Paraguay', flag: '🇵🇾' },
    { name: 'Peru', flag: '🇵🇪' },
    { name: 'Philippines', flag: '🇵🇭' },
    { name: 'Poland', flag: '🇵🇱' },
    { name: 'Portugal', flag: '🇵🇹' },
    { name: 'Qatar', flag: '🇶🇦' },
    { name: 'Romania', flag: '🇷🇴' },
    { name: 'Russia', flag: '🇷🇺' },
    { name: 'Saudi Arabia', flag: '🇸🇦' },
    { name: 'Serbia', flag: '🇷🇸' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'Slovakia', flag: '🇸🇰' },
    { name: 'Slovenia', flag: '🇸🇮' },
    { name: 'South Africa', flag: '🇿🇦' },
    { name: 'South Korea', flag: '🇰🇷' },
    { name: 'Spain', flag: '🇪🇸' },
    { name: 'Sri Lanka', flag: '🇱🇰' },
    { name: 'Sweden', flag: '🇸🇪' },
    { name: 'Switzerland', flag: '🇨🇭' },
    { name: 'Syria', flag: '🇸🇾' },
    { name: 'Taiwan', flag: '🇹🇼' },
    { name: 'Thailand', flag: '🇹🇭' },
    { name: 'Tunisia', flag: '🇹🇳' },
    { name: 'Turkey', flag: '🇹🇷' },
    { name: 'Ukraine', flag: '🇺🇦' },
    { name: 'United Arab Emirates', flag: '🇦🇪' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'Uruguay', flag: '🇺🇾' },
    { name: 'Venezuela', flag: '🇻🇪' },
    { name: 'Vietnam', flag: '🇻🇳' },
    { name: 'Yemen', flag: '🇾🇪' },
    { name: 'Zimbabwe', flag: '🇿🇼' }
  ];

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('flagGameDarkMode', darkMode);
  }, [darkMode]);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('flagGameDarkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  const generateQuestion = useCallback(() => {
    const correctFlag = flagData[Math.floor(Math.random() * flagData.length)];
    const wrongOptions = flagData
      .filter(flag => flag.name !== correctFlag.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const allOptions = [...wrongOptions, correctFlag].sort(() => 0.5 - Math.random());
    
    setCurrentFlag(correctFlag);
    setOptions(allOptions);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setStreak(0);
    generateQuestion();
  };

  const handleAnswer = (selectedFlag) => {
    if (selectedFlag.name === currentFlag.name) {
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      
      if (newStreak >= 20) {
        // Win condition
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('flagGameBestScore', newScore);
        }
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
          localStorage.setItem('flagGameBestStreak', newStreak);
        }
        setGameState('win');
      } else {
        // Continue game
        setIsLoadingNext(true);
        setTimeout(() => {
          setIsLoadingNext(false);
          generateQuestion();
        }, 200);
      }
    } else {
      // Wrong answer
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('flagGameBestScore', score);
      }
      if (streak > bestStreak) {
        setBestStreak(streak);
        localStorage.setItem('flagGameBestStreak', streak);
      }
      setGameState('gameOver');
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setStreak(0);
    setCurrentFlag(null);
    setOptions([]);
  };

  const MenuScreen = () => (
    <div className="text-center space-y-8">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-500 to-red-500 drop-shadow-lg">Flag Guesser</h1>
      </div>
      
      <div className="flex justify-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-200 to-pink-200 px-4 py-2 rounded-xl shadow">
          <Trophy className="w-5 h-5 text-yellow-500 transf" style={{ transform: 'translateY(5px)' }}/>
          <span className="font-bold text-lg">&nbsp;Best Score: <span className="text-pink-600">{bestScore}</span></span>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-200 to-green-200 px-4 py-2 rounded-xl shadow">
          <Star className="w-5 h-5 text-blue-500" style={{ transform: 'translateY(5px)' }}/>
          <span className="font-bold text-lg">&nbsp;Best Streak: <span className="text-green-600">{bestStreak}</span></span>
        </div>
      </div>
      
      <p className="text-lg text-gray-600 max-w-md mx-auto">
        Test your knowledge of world flags!<br />
        <span className="font-semibold text-blue-600">Can you guess 20 flags in a row?</span>
      </p>
      
      <div className="space-y-4">
        <button
          onClick={() => setShowHowToPlay(true)}
          className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors mx-auto shadow-md"
        >
          <Info className="w-5 h-5 align-middle" style={{ transform: 'translateY(5px)' }} />
          <span>&nbsp;How to Play</span>
        </button>
        <button
          onClick={() => setGameState('config')}
          className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors mx-auto shadow-lg"
        >
          <Settings className="w-5 h-5 align-middle" style={{ transform: 'translateY(5px)' }} />
          <span>&nbsp;Settings</span>
        </button>
        <button
          onClick={startGame}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-green-500 hover:to-blue-600 transition-transform transform hover:scale-105 mx-auto shadow-xl"
        >
          <Play className="w-5 h-5" style={{ transform: 'translateY(5px)' }}/>
          <span className="text-lg font-bold">&nbsp;Start Game</span>
        </button>
      </div>
      {showHowToPlay && <HowToPlayModal />}
    </div>
  );

  const ConfigScreen = () => (
    <div className="space-y-8 px-2 sm:px-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                !darkMode 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span>Light Mode</span>
            </button>
            <button
              onClick={() => setDarkMode(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setGameState('menu')}
        className="mt-8 w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-md"
      >
        Back to Menu
      </button>
    </div>
  );

  const GameScreen = () => (
    <div className="w-full max-w-lg mx-auto px-2 sm:px-4">
      <div className="flex justify-between items-center mb-6 text-base sm:text-lg flex-wrap gap-2">
        <div className="font-bold text-blue-700">Score: <span className="text-xl sm:text-2xl">{score}</span></div>
        <div className="font-bold text-green-600">Streak: <span className="text-xl sm:text-2xl">{streak}</span>/20</div>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center">
          <span className="flag-giant p-2 sm:p-4 md:p-8 rounded-full bg-gradient-to-br from-pink-400 via-yellow-300 to-blue-400 shadow-2xl border-4 sm:border-8 border-transparent bg-clip-padding animate-pulse"
            style={{ fontSize: '6rem', lineHeight: 1, maxWidth: '100%', width: '100%', display: 'inline-block' }}
          >
            <span className="block text-[5rem] xs:text-[7rem] sm:text-[10rem] md:text-[12rem] lg:text-[16rem] xl:text-[18rem] 2xl:text-[20rem]" style={{ lineHeight: 1 }}>{currentFlag?.flag}</span>
          </span>
        </div>
        <p className="text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 drop-shadow-lg mt-4">Which country is this flag from?</p>
      </div>

      {isLoadingNext ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="loader mb-4"></div>
          <span className="text-lg text-gray-500">Loading next flag...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-8 w-full max-w-md mx-auto">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full bg-white border-2 border-gradient-to-r from-pink-300 via-yellow-200 to-blue-300 hover:border-blue-400 text-left px-4 sm:px-8 py-4 sm:py-6 rounded-xl sm:rounded-2xl transition-all duration-200 hover:shadow-2xl hover:scale-105 font-semibold text-base sm:text-xl md:text-2xl"
              style={{ minWidth: 0, maxWidth: '100%' }}
            >
              <span className="bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-400 bg-clip-text text-transparent">
                {option.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const GameOverScreen = () => (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Game Over!</h2>
      <p className="text-xl text-red-600 font-semibold">Wrong answer!</p>
      <div className="text-2xl font-bold text-blue-700">
        Final Score: <span className="text-4xl">{score}</span>
      </div>
      <div className="text-lg text-gray-600">
        Streak: <span className="font-bold text-green-600">{streak}</span> flags
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetGame}
          className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
        >
          Main Menu
        </button>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-green-500 hover:to-blue-600 transition-transform transform hover:scale-105 shadow-xl"
        >
          Play Again
        </button>
      </div>
    </div>
  );

  const WinScreen = () => (
    <div className="text-center space-y-6">
      <Trophy className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
      <h2 className="text-3xl font-bold text-gray-800">Congratulations!</h2>
      <p className="text-xl text-green-600 font-semibold">You won! 🎉</p>
      <div className="text-2xl font-bold text-blue-700">
        Final Score: <span className="text-4xl">{score}</span>
      </div>
      <div className="text-lg text-gray-600">
        Perfect streak: <span className="font-bold text-green-600">20</span> flags!
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetGame}
          className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
        >
          Main Menu
        </button>
        <button
          onClick={startGame}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-green-500 hover:to-blue-600 transition-transform transform hover:scale-105 shadow-xl"
        >
          Play Again
        </button>
      </div>
    </div>
  );

  const HowToPlayModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-4 sm:p-8 max-w-lg w-full relative shadow-2xl mx-2 flex flex-col items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-center w-full">How to Play</h2>
          <span className="text-blue-500 font-bold">&nbsp;</span><span style={{ marginRight: '10px' }}>A flag will be displayed on screen.</span><br />
          <span className="text-blue-500 font-bold">&nbsp;</span><span style={{ marginRight: '10px' }}>⬇️</span><br />
          <span className="text-blue-500 font-bold">&nbsp;</span><span style={{ marginRight: '10px' }}>Choose the correct country name from the 4 options.</span><br />
          <span className="text-blue-500 font-bold">&nbsp;</span><span style={{ marginRight: '10px' }}>⬇️</span><br />
          <span className="text-blue-500 font-bold">&nbsp;</span><span style={{ marginRight: '10px' }}>Get 10 points for each correct answer.</span><br />
          <span className="text-blue-500 font-bold">&nbsp;</span><span style={{ marginRight: '10px' }}>⬇️</span><br />
          <span className="text-blue-500 font-bold">&nbsp;</span><span style={{ marginRight: '10px' }}>Guess 20 flags in a row to win!</span><br />
          <span className="text-blue-500 font-bold">&nbsp;</span><span style={{ marginRight: '10px' }}>⬇️</span><br />
          <span className="text-blue-500 font-bold">&nbsp;</span><span style={{ marginRight: '10px' }}>One wrong answer and the game ends.</span><br />
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
      case 'win':
        return <WinScreen />;
      case 'menu':
      default:
        return <MenuScreen />;
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-green-50'
    }`}>
      <div className="w-full max-w-lg">
        {renderGameState()}
      </div>
    </div>
  );
};

export default FlagGame; 
