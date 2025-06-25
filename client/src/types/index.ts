export interface Role {
  id: string;
  name: string;
  emoji: string;
  camp: "village" | "wolves" | "neutral";
  description: string;
  power?: string;
  objective: string;
  colorClass: string;
  borderClass: string;
  textClass: string;
  nightAction?: boolean;
  firstNightOnly?: boolean;
}

export interface PhaseStep {
  id: string;
  name: string;
  description: string;
  announcement?: string;
  icon: string;
  completed: boolean;
  active: boolean;
  roleRequired?: string;
}

export interface GamePhase {
  type: "preparation" | "night" | "day" | "finished";
  number: number;
  steps: PhaseStep[];
  currentStepIndex: number;
}

export interface PlayerStatus {
  id: number;
  name: string;
  position: number;
  status: "alive" | "dead";
  role?: string;
  isInLove: boolean;
  lovePartnerId?: number;
  revealedAt?: Date;
  diedAt?: Date;
}

export interface GameSession {
  id: number;
  status: "preparation" | "night" | "day" | "finished" | "abandoned";
  currentPhase: string;
  phaseNumber: number;
  currentStep: number;
  startedAt?: Date;
  finishedAt?: Date;
  winner?: "village" | "wolves" | "lovers";
  gameData?: any;
  players: PlayerStatus[];
}

export interface WinCondition {
  type: "village" | "wolves" | "lovers" | "tie";
  description: string;
  winners: PlayerStatus[];
}
