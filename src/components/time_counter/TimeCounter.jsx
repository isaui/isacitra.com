import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function calculateTimeRemaining() {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const timeDiff = target - now;

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor((timeDiff / 1000) % 60);
    const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
  }

  return (
    <div className='rounded-md text-yellow-600 px-3 py-2 bg-slate-950 text-lg md:text-xl lg:text-2xl '>
      Sisa {timeRemaining.days} Hari <span>:</span> {timeRemaining.hours}  Jam <span>:</span> {timeRemaining.minutes} Menit <span>:</span> {timeRemaining.seconds} Detik
    </div>
  );
};

export default CountdownTimer;
