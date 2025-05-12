import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('[data-start]');
const inputDate = document.querySelector('#datetime-picker');
let userSelectedDate = null;
let timer = null;
const refs = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];
    if (selected <= new Date()) {
      iziToast.error({
        title: '♻',
        message: 'Please choose a date in the future',
        position: 'topRight',
        icon: '',
        class: 'custom-error-toast',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
      userSelectedDate = selected;
    }
  },
};

flatpickr('#datetime-picker', options);

startBtn.disabled = true;

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;
  startBtn.disabled = true;
  inputDate.disabled = true;

  timer = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timer);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      inputDate.disabled = false;
      userSelectedDate = null;    // скинути дату після завершення
      startBtn.disabled = true;   // залишити кнопку неактивною
      return;
    }
    const time = convertMs(diff);
    updateTimer(time);
  }, 1000);
});


function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}