import { create } from 'zustand';
import moment from 'moment';

const today = moment().format('YYYY-MM-DD');
const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

let daysArray = [];
let currentDate = moment(startOfMonth);

while (currentDate.isSameOrBefore(endOfMonth)) {
  daysArray.push(currentDate.format('DD'));
  currentDate.add(1, 'day');
}

const useCalendarStore = create((set) => ({
  dates: daysArray,
  selectedDate: today,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

export default useCalendarStore;
