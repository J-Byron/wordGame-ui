import GuessCell from "../GuessCell";

const GuessList = ({ guesses = [] }) => {
  return (
    <div className="guessList">
      {guesses.length > 0 &&
        guesses
          .sort((a, b) => a.pos - b.pos)
          .map((guess) => <GuessCell key={guess.pos} guess={guess} />)}
    </div>
  );
};

export default GuessList;
