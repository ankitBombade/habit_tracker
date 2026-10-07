export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatTime24to12(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // 0 becomes 12
  return `${h}:${m} ${ampm}`;
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function calculateDurationMinutes(startTime: string, endTime: string): number {
  let startMins = parseTimeToMinutes(startTime);
  let endMins = parseTimeToMinutes(endTime);
  if (endMins < startMins) {
    // Crosses midnight (e.g., 23:30 to 01:30)
    endMins += 24 * 60;
  }
  return endMins - startMins;
}

export function isCurrentTimeInBlock(startTime: string, endTime: string): boolean {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  let startMins = parseTimeToMinutes(startTime);
  let endMins = parseTimeToMinutes(endTime);

  if (endMins < startMins) {
    // Crosses midnight
    return currentMins >= startMins || currentMins < endMins;
  }

  return currentMins >= startMins && currentMins < endMins;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning, Champion';
  if (hour < 17) return 'Good Afternoon, Scholar';
  if (hour < 22) return 'Good Evening, Master';
  return 'Late Night Focus, Warrior';
}
