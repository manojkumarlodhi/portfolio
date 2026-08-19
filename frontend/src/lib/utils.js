import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatUrl(url) {
  if (!url || url === "#") return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("mailto:") || url.startsWith("tel:")) return url;
  return `https://${url}`;
}
