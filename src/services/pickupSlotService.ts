import type { TimeSlot } from '../app/components/NRI/types';

const windows = [
  { id: 'morning', timeRange: '09:00 AM – 11:00 AM', label: 'Morning' },
  { id: 'midday', timeRange: '11:00 AM – 01:00 PM', label: 'Midday' },
  { id: 'afternoon', timeRange: '01:00 PM – 03:00 PM', label: 'Afternoon' },
  { id: 'evening', timeRange: '03:00 PM – 05:00 PM', label: 'Evening' },
  { id: 'late-evening', timeRange: '05:00 PM – 07:00 PM', label: 'Late evening' },
];

// These are preferences, not verified dispatch capacity. No network request.
export function getPickupSlots(date: string): { date: string; slots: TimeSlot[] } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('A valid pickup date is required.');
  return { date, slots: windows.map(slot => ({ ...slot, status: 'PREFERENCE' })) };
}
