import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(relativeTime);
dayjs.locale('fr');

export function formatDateShort(date: string | Date) {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
}

export function formatDateRelative(date: string | Date) {
  return dayjs(date).fromNow();
}
