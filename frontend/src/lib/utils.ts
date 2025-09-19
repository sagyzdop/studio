import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toPng } from 'html-to-image';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const downloadImage = (element: HTMLElement | null, filename: string) => {
  if (!element) return;
  toPng(element, { cacheBust: true, pixelRatio: 2 })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error('oops, something went wrong!', err);
    });
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};