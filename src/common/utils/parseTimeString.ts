export function parseTimeString(timeString: string): number {
  if (timeString.endsWith('d')) {
    return parseInt(timeString.slice(0, -1), 10) * 86400000;
  }
  if (timeString.endsWith('h')) {
    return parseInt(timeString.slice(0, -1), 10) * 3600000;
  }
  if (timeString.endsWith('m')) {
    return parseInt(timeString.slice(0, -1), 10) * 60000;
  }
  if (timeString.endsWith('s')) {
    return parseInt(timeString.slice(0, -1), 10) * 1000;
  }
  throw new Error('Invalid time string');
}
