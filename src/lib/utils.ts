import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSeason = (mesAno: string): 'Verão' | 'Outono' | 'Inverno' | 'Primavera' => {
  const month = parseInt(mesAno.split('/')[0], 10);
  if (month === 12 || month === 1 || month === 2) return 'Verão';
  if (month >= 3 && month <= 5) return 'Outono';
  if (month >= 6 && month <= 8) return 'Inverno';
  return 'Primavera';
};
