// This file contains utility functions for API calls and cookie management.
export const API_BASE = import.meta.env.VITE_API_BASE_URL // || 'https://localhost:7259/api';

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}
