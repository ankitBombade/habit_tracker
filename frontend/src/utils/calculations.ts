/**
 * Discipline Score Formula:
 * 40% Study Accuracy
 * 25% Habit Completion
 * 20% Timetable Adherence
 * 15% Sleep Consistency
 */
export function calculateDisciplineScore(
  studyAccuracy: number,
  habitCompletion: number,
  timetableAdherence: number,
  sleepConsistency: number
): number {
  const score =
    0.40 * Math.min(100, Math.max(0, studyAccuracy)) +
    0.25 * Math.min(100, Math.max(0, habitCompletion)) +
    0.20 * Math.min(100, Math.max(0, timetableAdherence)) +
    0.15 * Math.min(100, Math.max(0, sleepConsistency));
  
  return Number(score.toFixed(1));
}

/**
 * Study Accuracy Formula:
 * Actual Hours / Planned Hours * 100
 */
export function calculateStudyAccuracy(plannedMinutes: number, actualMinutes: number): number {
  if (plannedMinutes <= 0) return 100;
  const accuracy = (actualMinutes / plannedMinutes) * 100;
  return Number(accuracy.toFixed(1));
}

/**
 * Habit Consistency Formula:
 * Completed Days / Planned Days * 100
 */
export function calculateHabitConsistency(completedDays: number, totalDays: number): number {
  if (totalDays <= 0) return 0;
  const consistency = (completedDays / totalDays) * 100;
  return Number(consistency.toFixed(1));
}

export function formatHoursAndMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
