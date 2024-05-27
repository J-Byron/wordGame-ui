import { useEffect, useState } from "react";
import Confetti from "./Confetti";

const CompletedLevelPopup = ({
  level,
  handleCloseClick,
  handleNextClick,
  handleSeeClosestWordsClick,
  correctWord = null,
  stats,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleConfetti = () => setShowConfetti(!showConfetti);

  // Reset the lottie key on every (render && completedLevel)
  useEffect(() => {
    // Basically I want the lottie to reset everytime the user switches from completed level to completed level
    // The issue is that the only way to conditionally reset a lottie is to edit the @key property and
    // I need to do it on every render in case the user switches between completed levels
    toggleConfetti();
  }, [level]);

  const { guesses, green, yellow, red, longestColdStreak, longestHotStreak, percentile } = stats;
  return (
    <div>
      <div className="completedLevelPopup_backdrop" onClick={() => handleCloseClick()}>
        <Confetti toggle={showConfetti} />
        <div
          className="completedLevelPopup_container"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="completedLevelPopup_title">You completed level {level}!</span>
          <div className="completedLevelPopup_word">{correctWord}</div>
          <div className="completedLevelPopup_statsContainer">
            {/* <span>stats</span> */}
            {/* Line, total guesses, green, yellow, red, longest streak, share  */}
            <div>
              total guesses: <span className="bold">{guesses}</span>
            </div>
            <div className="completedLevelPopup_colors">
              <div>{green}</div>
              <div>{yellow}</div>
              <div>{red}</div>
            </div>
            <div>
              best hot streak : 🔥 <span className="bold">{longestHotStreak}</span>
            </div>
            <div>
              worst cold streak : ❄️ <span className="bold">{longestColdStreak}</span>
            </div>
            <div>
              percentile: <span className="bold">{percentile}</span>
            </div>
            <span className="completedLevelPopup_closest" onClick={handleSeeClosestWordsClick}>
              see closest words
            </span>
          </div>
          <div className="completedLevelPopup_footer">
            <div className="completedLevelPopup_closeButton" onClick={handleCloseClick}>
              Close
            </div>
            <div className="completedLevelPopup_nextButton" onClick={handleNextClick}>
              Next
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedLevelPopup;
