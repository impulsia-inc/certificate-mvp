export function generateReference(sequenceNumber: number, year?: number): string {
  const currentYear = year || new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);
  const sequenceStr = sequenceNumber.toString().padStart(6, '0');
  
  return `FYN-${yearSuffix}-${sequenceStr}`;
}

export function parseReference(reference: string): { prefix: string; year: number; sequence: number } | null {
  const match = reference.match(/^(FYN)-(\d{2})-(\d{6})$/);
  
  if (!match) {
    return null;
  }
  
  return {
    prefix: match[1],
    year: parseInt(match[2], 10),
    sequence: parseInt(match[3], 10),
  };
}

export function isValidReference(reference: string): boolean {
  return /^(FYN)-(\d{2})-(\d{6})$/.test(reference);
}
