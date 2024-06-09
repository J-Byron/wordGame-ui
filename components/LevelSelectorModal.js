import { useState, useEffect } from "react";

const LevelSelectorModal = ({ levels, handleLevelClick, handleClose }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current time in UTC
      const now = new Date();
      // Calculate current time in EST (UTC-5)
      const estOffset = -5 * 60; // EST is UTC-5
      const estNow = new Date(now.getTime() + estOffset * 60000);

      // Calculate the next day in EST
      const nextDay = new Date(estNow);
      nextDay.setDate(estNow.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);

      // Calculate the difference in milliseconds
      const timeDiff = nextDay - estNow;

      // Convert the difference to hours, minutes, and seconds
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
    <div className="levelSelectorModal_backdrop" onClick={handleClose}>
      <div className="modal_wrapper">
        <div className="countdown">
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
        <div className="modal_closeButton" />
        <div
          className="levelSelectorModal_container"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {[{ level: "?" }, ...levels].map(({ level, isComplete }, index) => {
            return (
              <div
                className={`levelSelectorModal_cell ${isComplete ? "green" : ""}`}
                onClick={() => {
                  handleLevelClick(level);
                }}
                key={index}
              >
                {/* <span>Level</span> */}
                <span className={index == 0 ? "random" : ""}>#{level}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default LevelSelectorModal;
