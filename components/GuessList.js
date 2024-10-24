import GuessCell from "./GuessCell";

const GuessList = ({ guesses = [], highlightedWords = [], size = "md" }) => {
  return (
    <div className={`guessList ${size}`}>
      {guesses.length &&
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
