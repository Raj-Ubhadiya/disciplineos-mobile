export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatMinutes(value: number) {
  if (value >= 60) {
    const hours = value / 60;
    return `${hours.toFixed(hours % 1 === 0 ? 0 : 1)}h`;
  }

  return `${value}m`;
}
