export const addDays = (date, days) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

export const calculateFine = (dueDate, returnDate = new Date()) => {
  if (returnDate <= dueDate) return 0;
  const msPerDay = 1000 * 60 * 60 * 24;
  const overdueDays = Math.ceil((returnDate - dueDate) / msPerDay);
  const finePerDay = Number(process.env.FINE_PER_DAY || 5);
  return overdueDays * finePerDay;
};
