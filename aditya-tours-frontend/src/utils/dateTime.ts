export function toIsoDateTime(date: string, time: string) {
  if (!date || !time) return '';
  return new Date(`${date}T${time}:00`).toISOString();
}

export function nowDateString() {
  return new Date().toISOString().split('T')[0];
}

export function isReturnAfterDeparture(
  departureDate: string,
  departureTime: string,
  returnDate: string,
  returnTime: string,
) {
  const departure = new Date(`${departureDate}T${departureTime}:00`).getTime();
  const returning = new Date(`${returnDate}T${returnTime}:00`).getTime();
  return returning > departure;
}
