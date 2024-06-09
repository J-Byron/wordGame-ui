import GuessCell from "./GuessCell";

const GuessList = ({ guesses = [], highlightedWords, size = "md" }) => {
  return (
    <div className="guessList">
      {guesses.length > 0 &&
        guesses
          .sort((a, b) => a.pos - b.pos)
          .map((guess) => (
            <GuessCell
              key={guess.pos}
              guess={guess}
              isHighlighted={highlightedWords.includes(guess.word)}
              size={size}
            />
          ))}
    </div>
  );
};

export default GuessList;
