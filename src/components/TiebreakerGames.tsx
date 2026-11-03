import React, { useState } from 'react';
import { Coins, CircleDot, Dices, RotateCcw, Sparkles, Brain, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DecisionAnalysis } from '../types';

interface TiebreakerGamesProps {
  analysis: DecisionAnalysis;
}

export const TiebreakerGames: React.FC<TiebreakerGamesProps> = ({ analysis }) => {
  const { options } = analysis;
  const [activeGame, setActiveGame] = useState<'coin' | 'wheel' | 'dice'>('coin');

  // Coin Flip State
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [coinRotation, setCoinRotation] = useState(0);

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelWinner, setWheelWinner] = useState<string | null>(null);

  // Dice State
  const [isRolling, setIsRolling] = useState(false);
  const [diceNumber, setDiceNumber] = useState<number | null>(null);

  // 1. Coin Flip logic
  const handleFlipCoin = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCoinResult(null);

    const isHeads = Math.random() > 0.5;
    const spins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    const newRotation = coinRotation + spins * 360 + (isHeads ? 0 : 180);
    setCoinRotation(newRotation);

    setTimeout(() => {
      setIsFlipping(false);
      setCoinResult(isHeads ? 'heads' : 'tails');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#38bdf8', '#10b981'],
      });
    }, 1800);
  };

  // 2. Wheel logic
  const handleSpinWheel = () => {
    if (isSpinning || options.length === 0) return;
    setIsSpinning(true);
    setWheelWinner(null);

    const numOptions = options.length;
    const winningIndex = Math.floor(Math.random() * numOptions);
    const sliceAngle = 360 / numOptions;
    const extraRotations = 5 * 360; // 5 full spins
    // Point at top (270 deg)
    const targetAngle = extraRotations + (360 - (winningIndex * sliceAngle + sliceAngle / 2));
    const nextRotation = wheelRotation + targetAngle;

    setWheelRotation(nextRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWheelWinner(options[winningIndex].title);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#f59e0b'],
      });
    }, 3200);
  };

  // 3. Dice logic
  const handleRollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setDiceNumber(null);

    setTimeout(() => {
      const numOptions = options.length;
      const res = Math.floor(Math.random() * numOptions);
      setDiceNumber(res);
      setIsRolling(false);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  const optionA = options[0];
  const optionB = options[1] || options[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
          <Brain className="w-3.5 h-3.5" />
          <span>The Subconscious Tiebreaker Resolvers</span>
        </div>
        <h3 className="text-2xl font-extrabold text-white">
          When Reason Stalls, Let Your Subconscious Speak
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-1">
          When two options appear equally balanced on paper, your nervous system often knows what it actually desires.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setActiveGame('coin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeGame === 'coin'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>The "Mid-Air" Coin Flip</span>
        </button>

        <button
          onClick={() => setActiveGame('wheel')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeGame === 'wheel'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CircleDot className="w-4 h-4" />
          <span>Decision Wheel ({options.length} Options)</span>
        </button>

        <button
          onClick={() => setActiveGame('dice')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeGame === 'dice'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Dices className="w-4 h-4" />
          <span>Decision Dice</span>
        </button>
      </div>

      {/* GAME 1: COIN FLIP */}
      {activeGame === 'coin' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-amber-500/30 text-center space-y-6 shadow-xl">
          {/* Subconscious Psychology Note */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-xs text-amber-200/90 max-w-lg mx-auto">
            <span className="font-bold text-amber-300">The Psychologist's Coin Trick: </span>
            Don't just look at how it lands. When the coin is in the air, pay close attention to your heart: <strong className="text-white">which side are you secretly praying will land?</strong> That is your real answer.
          </div>

          {/* Option mappings */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-xs font-semibold">
            <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-400/30 text-left">
              <span className="text-amber-400 block text-[10px] uppercase font-bold">HEADS</span>
              <span className="text-white text-sm line-clamp-1">{optionA.title}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/90 border border-cyan-400/30 text-left">
              <span className="text-cyan-400 block text-[10px] uppercase font-bold">TAILS</span>
              <span className="text-white text-sm line-clamp-1">{optionB.title}</span>
            </div>
          </div>

          {/* 3D Coin Element */}
          <div className="py-6 flex items-center justify-center perspective-1000">
            <div
              className={`w-36 h-36 rounded-full border-4 border-amber-300/80 shadow-2xl shadow-amber-500/30 flex items-center justify-center font-extrabold text-2xl transition-transform duration-[1800ms] ease-out transform-style-3d cursor-pointer ${
                isFlipping ? 'animate-pulse' : ''
              }`}
              style={{
                background: 'radial-gradient(circle, #f59e0b 0%, #b45309 80%, #78350f 100%)',
                transform: `rotateY(${coinRotation}deg)`,
              }}
              onClick={handleFlipCoin}
            >
              <div className="text-slate-950 select-none tracking-widest text-lg font-black">
                {isFlipping ? '...' : coinResult ? coinResult.toUpperCase() : 'FLIP ME'}
              </div>
            </div>
          </div>

          {/* Mid-air prompt or result */}
          {isFlipping && (
            <div className="text-sm font-bold text-amber-300 animate-bounce">
              🪙 In the air! What are you secretly hoping for right now?
            </div>
          )}

          {coinResult && !isFlipping && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-400/50 max-w-md mx-auto animate-in zoom-in duration-300">
              <div className="text-xs uppercase font-bold text-amber-400 mb-1">
                Landed on {coinResult.toUpperCase()}!
              </div>
              <div className="text-lg font-extrabold text-white">
                {coinResult === 'heads' ? optionA.title : optionB.title}
              </div>
              <p className="text-xs text-slate-400 mt-1 italic">
                Did you feel relieved or slightly disappointed? If you felt disappointed, pick the other one!
              </p>
            </div>
          )}

          {/* Action button */}
          <div>
            <button
              onClick={handleFlipCoin}
              disabled={isFlipping}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              {isFlipping ? 'Coin is in mid-air...' : 'Flip The Coin'}
            </button>
          </div>
        </div>
      )}

      {/* GAME 2: DECISION WHEEL */}
      {activeGame === 'wheel' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-center space-y-6 shadow-xl">
          <div className="text-xs text-slate-400">
            Spin the decision wheel with all {options.length} options equally represented.
          </div>

          {/* SVG Wheel representation */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Pointer arrow at top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 drop-shadow-md" />

            <div
              className="w-full h-full rounded-full border-4 border-slate-700 shadow-2xl overflow-hidden transition-transform duration-[3200ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {options.map((opt, i) => {
                  const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
                  const color = colors[i % colors.length];
                  const slice = 360 / options.length;
                  const startAngle = i * slice;
                  const endAngle = (i + 1) * slice;
                  
                  // SVG arc path calculation
                  const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                  const largeArcFlag = slice > 180 ? 1 : 0;
                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                  return (
                    <g key={opt.id}>
                      <path d={pathData} fill={color} stroke="#0f172a" strokeWidth="0.8" />
                      <text
                        x="50"
                        y="22"
                        transform={`rotate(${startAngle + slice / 2}, 50, 50)`}
                        fill="#ffffff"
                        fontSize="5"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {String.fromCharCode(65 + i)}
                      </text>
                    </g>
                  );
                })}
                <circle cx="50" cy="50" r="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {options.map((opt, i) => {
              const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
              return (
                <div key={opt.id} className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                  <span className="text-slate-300">
                    {String.fromCharCode(65 + i)}: {opt.title}
                  </span>
                </div>
              );
            })}
          </div>

          {wheelWinner && !isSpinning && (
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-400/50 max-w-md mx-auto animate-in zoom-in duration-300">
              <div className="text-xs uppercase font-bold text-purple-400 mb-1 flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> Wheel Selected
              </div>
              <div className="text-lg font-extrabold text-white">
                {wheelWinner}
              </div>
            </div>
          )}

          <div>
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-600/30 active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
            </button>
          </div>
        </div>
      )}

      {/* GAME 3: DECISION DICE */}
      {activeGame === 'dice' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-center space-y-6 shadow-xl">
          <div className="text-xs text-slate-400">
            Roll the dice to randomly assign fate and evaluate your immediate visceral reaction.
          </div>

          <div className="py-6 flex items-center justify-center">
            <div
              onClick={handleRollDice}
              className={`w-28 h-28 rounded-2xl bg-gradient-to-tr from-cyan-600 to-sky-400 text-slate-950 flex items-center justify-center font-black text-4xl shadow-xl shadow-cyan-500/20 border-2 border-cyan-200 cursor-pointer select-none transition-transform ${
                isRolling ? 'animate-spin' : 'hover:scale-105 active:scale-95'
              }`}
            >
              {isRolling ? '🎲' : diceNumber !== null ? String.fromCharCode(65 + diceNumber) : '🎲'}
            </div>
          </div>

          {diceNumber !== null && !isRolling && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-400/50 max-w-md mx-auto animate-in zoom-in duration-300">
              <div className="text-xs uppercase font-bold text-cyan-400 mb-1">
                Dice Landed On:
              </div>
              <div className="text-lg font-extrabold text-white">
                Option {String.fromCharCode(65 + diceNumber)}: {options[diceNumber]?.title}
              </div>
            </div>
          )}

          <div>
            <button
              onClick={handleRollDice}
              disabled={isRolling}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-600/30 active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              {isRolling ? 'Rolling Dice...' : 'Roll Dice'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
