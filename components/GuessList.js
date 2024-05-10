import GuessCell from "./GuessCell";

const GuessList = ({ guesses = [], lastGuess }) => {
  return (
    <div className="guessList">
      {guesses.length > 0 &&
        guesses
          .sort((a, b) => a.pos - b.pos)
          .map((guess) => (
            <GuessCell
              key={guess.pos}
              guess={guess}
              isHighlighted={lastGuess === guess.word}
            />
          ))}
    </div>
  );
};

export default GuessList;
