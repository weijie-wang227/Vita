export function formatDate(dateString: string, timeString: string) {
  const date = new Date(`${dateString} ${timeString}`);

  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}