import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatRelativeTime(date) {
  return dayjs(date).fromNow();
}

export function formatDate(date, format = 'MMMM D, YYYY') {
  return dayjs(date).format(format);
}