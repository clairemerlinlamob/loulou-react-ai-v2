import { createContext, useContext, useReducer, ReactNode } from "react";
import type { GameSession, PlayerStatus, GamePhase } from "@/types";
import { PREPARATION_STEPS, NIGHT_STEPS, DAY_STEPS } from "@/constants/phases";

interface GameState {
  currentGame: GameSession | null;
  players: PlayerStatus[];
  currentPhase: GamePhase | null;
  isLoading: boolean;
  error: string | null;
}

type GameAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_GAME"; payload: GameSession }
  | { type: "SET_PLAYERS"; payload: PlayerStatus[] }
  | { type: "UPDATE_PLAYER"; payload: { id: number; updates: Partial<PlayerStatus> } }
  | { type: "SET_PHASE"; payload: GamePhase }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "COMPLETE_STEP"; payload: string }
  | { type: "RESET_GAME" };

const initialState: GameState = {
  currentGame: null,
  players: [],
  currentPhase: null,
  isLoading: false,
  error: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_GAME":
      return { ...state, currentGame: action.payload };

    case "SET_PLAYERS":
      return { ...state, players: action.payload };

    case "UPDATE_PLAYER":
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.id
            ? { ...player, ...action.payload.updates }
            : player
        ),
      };

    case "SET_PHASE":
      return { ...state, currentPhase: action.payload };

    case "NEXT_STEP":
      if (!state.currentPhase) return state;
      const nextStepIndex = Math.min(
        state.currentPhase.currentStepIndex + 1,
        state.currentPhase.steps.length - 1
      );
      return {
        ...state,
        currentPhase: {
          ...state.currentPhase,
          currentStepIndex: nextStepIndex,
          steps: state.currentPhase.steps.map((step, index) => ({
            ...step,
            active: index === nextStepIndex,
            completed: index < nextStepIndex,
          })),
        },
      };

    case "PREVIOUS_STEP":
      if (!state.currentPhase) return state;
      const prevStepIndex = Math.max(state.currentPhase.currentStepIndex - 1, 0);
      return {
        ...state,
        currentPhase: {
          ...state.currentPhase,
          currentStepIndex: prevStepIndex,
          steps: state.currentPhase.steps.map((step, index) => ({
            ...step,
            active: index === prevStepIndex,
            completed: index < prevStepIndex,
          })),
        },
      };

    case "COMPLETE_STEP":
      if (!state.currentPhase) return state;
      return {
        ...state,
        currentPhase: {
          ...state.currentPhase,
          steps: state.currentPhase.steps.map(step =>
            step.id === action.payload ? { ...step, completed: true } : step
          ),
        },
      };

    case "RESET_GAME":
      return initialState;

    default:
      return state;
  }
}

interface GameContextValue extends GameState {
  dispatch: React.Dispatch<GameAction>;
  createPhase: (type: GamePhase["type"], number: number) => GamePhase;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const createPhase = (type: GamePhase["type"], number: number): GamePhase => {
    let steps;
    switch (type) {
      case "preparation":
        steps = [...PREPARATION_STEPS];
        break;
      case "night":
        steps = [...NIGHT_STEPS];
        break;
      case "day":
        steps = [...DAY_STEPS];
        break;
      default:
        steps = [];
    }

    return {
      type,
      number,
      steps: steps.map((step, index) => ({
        ...step,
        active: index === 0,
        completed: false,
      })),
      currentStepIndex: 0,
    };
  };

  return (
    <GameContext.Provider value={{ ...state, dispatch, createPhase }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}
