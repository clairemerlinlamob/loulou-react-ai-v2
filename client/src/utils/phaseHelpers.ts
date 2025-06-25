import type { PhaseStep, PlayerStatus } from "@/types";
import { NIGHT_STEPS, DAY_STEPS } from "@/constants/phases";
import { ROLES } from "@/constants/roles";

export function getActiveNightSteps(players: PlayerStatus[], phaseNumber: number): PhaseStep[] {
  const alivePlayers = players.filter(p => p.status === "alive");
  
  return NIGHT_STEPS.filter(step => {
    if (!step.roleRequired) return true;
    
    const role = ROLES[step.roleRequired];
    if (!role) return false;
    
    // Check if role is present and alive
    const playersWithRole = alivePlayers.filter(p => p.role === step.roleRequired);
    if (playersWithRole.length === 0) return false;
    
    // Check first night only restriction
    if (role.firstNightOnly && phaseNumber > 1) return false;
    
    return true;
  });
}

export function getActiveDaySteps(): PhaseStep[] {
  return [...DAY_STEPS];
}

export function getStepAnnouncement(step: PhaseStep, context?: any): string {
  if (step.announcement) {
    return step.announcement;
  }
  
  // Generate dynamic announcements based on step and context
  switch (step.id) {
    case "sunrise":
      return "Le jour se lève sur le village. Que s'est-il passé cette nuit ?";
    case "discussion":
      return "Les villageois se rassemblent pour discuter des événements de la nuit.";
    case "vote":
      return "Il est temps de voter pour éliminer un suspect.";
    case "elimination":
      return "Le village a pris sa décision...";
    default:
      return step.description;
  }
}

export function getNextPhase(currentPhase: string): string {
  switch (currentPhase) {
    case "preparation":
      return "night";
    case "night":
      return "day";
    case "day":
      return "night";
    case "finished":
      return "finished";
    default:
      return "preparation";
  }
}

export function formatPhaseDisplay(phase: string, number: number): string {
  switch (phase) {
    case "preparation":
      return "Préparation";
    case "night":
      return `Nuit N°${number}`;
    case "day":
      return `Jour N°${number}`;
    case "finished":
      return "Partie terminée";
    default:
      return "Phase inconnue";
  }
}

export function getPhaseIcon(phase: string): string {
  switch (phase) {
    case "preparation":
      return "fas fa-cog";
    case "night":
      return "fas fa-moon";
    case "day":
      return "fas fa-sun";
    case "finished":
      return "fas fa-flag-checkered";
    default:
      return "fas fa-question";
  }
}

export function getPhaseColorClass(phase: string): string {
  switch (phase) {
    case "preparation":
      return "bg-gray-700";
    case "night":
      return "bg-indigo-900";
    case "day":
      return "bg-yellow-700";
    case "finished":
      return "bg-green-700";
    default:
      return "bg-gray-700";
  }
}
