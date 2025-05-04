// written by: Ammar Akif
// debugged by: Ammar Akif
// tested by: Hussnain Yasir 
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
