import React from "react";

export const HowToPlay = () => {
  return (
    <div className="howToPlay_container">
      <div className="header">How to play</div>
      <div className="howToPlay_step">
        <span className="howToPlay_step_header">1</span>
        <span className="howToPlay_step_content">Guess a word</span>
      </div>
      <div className="howToPlay_step">
        <span className="howToPlay_step_header">2</span>
        <span className="howToPlay_step_content">
          Use the feedback to refine your guesses and improve word association
          skills
        </span>
      </div>
      <div className="howToPlay_step">
        <span className="howToPlay_step_header">3</span>
        <span className="howToPlay_step_content">
          Win the game by guessing the word at position 0
        </span>
      </div>
    </div>
  );
};
