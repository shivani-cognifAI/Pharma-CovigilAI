export const E2BR3DateTimeConvertZone = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Get time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Get timezone offset
  const offset = date.getTimezoneOffset();
  const timezone = Math.abs(offset);
  const timezoneHours = String(Math.floor(timezone / 60)).padStart(2, '0');
  const timezoneMinutes = String(timezone % 60).padStart(2, '0');
  const timezoneSign = offset > 0 ? '-' : '+';

  return `${year}${month}${day}${hours}${minutes}${seconds}${timezoneSign}${timezoneHours}${timezoneMinutes}`;
};

export const E2BR3DateTimeConvert = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Get time components
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

