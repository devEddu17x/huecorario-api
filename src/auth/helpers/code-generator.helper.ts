export function generateCode(): number {
  // Generates a random 6-digit code
  return Math.floor(Math.random() * 900000) + 100000;
}
