import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}



export function formatDate(date) {
  if (!date) return 'Date not set';
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  } catch (error) {
    console.error('Invalid date provided to formatDate:', date, error);
    return 'Invalid Date';
  }
}

export function formatTime(date) {
  if (!date) return 'Time not set';
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  } catch (error) {
    console.error('Invalid date provided to formatTime:', date, error);
    return 'Invalid Time';
  }
}

export function formatDateTime(date) {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
