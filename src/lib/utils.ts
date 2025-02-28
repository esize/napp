import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeRedirect(url: string): string {
  const returnTo = decodeURIComponent(url);
  if (returnTo.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return "/";
}
