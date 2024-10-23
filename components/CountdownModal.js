import { useEffect, useState } from "react";

const CountdownModal = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // TODO find timezone of GAE
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current time in UTC
      const now = new Date();
      const utcOffset = now.getTimezoneOffset(); // Get current UTC offset in minutes

      // Calculate current time in EST (UTC-5)
      const estOffset = -5 * 60; // EST is UTC-5
      const estNow = new Date(now.getTime() + (utcOffset + estOffset) * 60000);

      // Set target time for 00:00 EST (which is 05:00 UTC of the next day)
      const nextMidnight = new Date(estNow);
      nextMidnight.setUTCHours(5, 0, 0, 0); // Set to 00:00 EST (05:00 UTC)

      // Calculate time difference in milliseconds
      let timeDiff = nextMidnight - estNow;

      if (timeDiff < 0) {
        // If current time is already past midnight, move to next day
        nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
        timeDiff = nextMidnight - estNow;
      }

      // Convert time difference to hours, minutes, seconds
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    // Initial calculation
    calculateTimeLeft();

    // Update the countdown every second
    const intervalId = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="countdown">
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

export default CountdownModal;
