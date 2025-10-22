import { useState, useEffect, useRef } from "react";
import { useOpenAiGlobal } from "../utils/use-openai-global";
import { useDisplayMode } from "../utils/use-display-mode";
import { useWidgetState } from "../utils/use-widget-state";

const rounds = ["Superman", "Jimmy Kimmel", "Batman", "Mickey Mouse", "Red Hot Chilli Peppers"]

export default function App() {
  const [widgetState, setWidgetState] = useWidgetState({
    gameState: "waiting",
    round: 0,
    target: ""
  });
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [isDone, setIsDone] = useState(false);
  const [previousGuess, setPreviousGuess] = useState("");
  const displayMode = useDisplayMode();
  const toolInput = useOpenAiGlobal("toolInput");
  const toolOutput = useOpenAiGlobal("toolOutput");
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!widgetState || widgetState.gameState !== "playing") {
      if(!widgetState) setWidgetState({ gameState: "waiting", round: 0, target: "" });
      return;
    }
    
    if (secondsLeft <= 0) {
      setIsDone(true);
      setWidgetState({ gameState: "ended" });
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (displayMode === "pip") {
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setIsDone(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);

      if (toolInput.guess && toolInput.guess.toLowerCase() === widgetState.target.toLowerCase() && toolInput.guess !== previousGuess) {
        setPreviousGuess(toolInput.guess);
        setWidgetState({ gameState: "playing", round: widgetState.round + 1, target: rounds[widgetState.round] });
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [widgetState, displayMode, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes}:${String(seconds).padStart(2, "0")}`;

  const handleStart = async () => {
    await window.openai.requestDisplayMode({ mode: "pip" });
    setWidgetState({ gameState: "playing", round: 1, target: rounds[0] });
  };

  // Handle null widgetState
  if (!widgetState || !widgetState.gameState) {
    return (
      <div className="antialiased w-full h-[320px] text-black px-4 border border-black/10 rounded-2xl sm:rounded-3xl overflow-hidden bg-white relative flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased w-full h-[320px] text-black px-4 border border-black/10 rounded-2xl sm:rounded-3xl overflow-hidden bg-white relative flex items-center justify-center">
      {/* Waiting state - Show Start button */}
      {widgetState.gameState === "waiting" && (
        <button
          onClick={handleStart}
          className="px-8 py-4 bg-black text-white text-2xl font-bold rounded-lg hover:bg-black/90 active:scale-95 transition-all"
        >
          Start
        </button>
      )}

      {/* Playing state but not in pip mode - Show Resume button */}
      {widgetState.gameState === "playing" && displayMode !== "pip" && (
        <button
          onClick={handleStart}
          className="px-8 py-4 bg-black text-white text-2xl font-bold rounded-lg hover:bg-black/90 active:scale-95 transition-all"
        >
          Resume
        </button>
      )}

      {/* Playing state in pip mode - Main game UI */}
      {widgetState.gameState === "playing" && displayMode === "pip" && (
        <>
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-black/10 flex items-center justify-center text-lg font-semibold select-none">
            {formatted}
          </div>
          
          <div className="absolute bottom-4 left-4 px-3 py-2 text-black text-sm font-semibold rounded-lg select-none">
            Round {widgetState.round}
          </div>

          <div className={`absolute bottom-4 right-4 px-3 py-2 text-white text-sm font-semibold rounded-lg select-none ${toolInput.guess && toolInput.guess.toLowerCase() === widgetState.target.toLowerCase() ? 'bg-green-500' : 'bg-red-500'}`}>
            {toolInput.guess || 'No guess yet'}
          </div>
          
          <div className="text-4xl font-bold text-center">
            {widgetState.target}
          </div>
        </>
      )}

      {/* Ended state - Game over UI */}
      {widgetState.gameState === "ended" && (
        <div className="text-center">
          <div className="text-4xl font-bold text-red-600 mb-4">
            Game Over!
          </div>
          <div className="text-xl text-gray-600 mb-6">
            Final Score: {widgetState.round - 1} rounds
          </div>
        </div>
      )}
    </div>
  );
}