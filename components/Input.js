import { useState, useEffect } from "react";

const Input = ({ handleSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const [isClient, setIsClient] = useState(false); // run dynamic unpredictable code on client only
  const getRandomWord = () => {
    const words = [
      "apple",
      "banana",
      "cat",
      "dog",
      "elephant",
      "fish",
      "goat",
      "hat",
      "ice",
      "jacket",
      "kite",
      "lion",
      "monkey",
      "nest",
      "orange",
      "pear",
      "queen",
      "rabbit",
      "snake",
      "tree",
      "umbrella",
      "vase",
      "watch",
      "xylophone",
      "yak",
      "zebra",
      "ant",
      "ball",
      "car",
      "duck",
      "egg",
      "frog",
      "giraffe",
      "house",
      "ink",
      "jug",
      "key",
      "lemon",
      "mouse",
      "net",
      "owl",
      "pencil",
      "quilt",
      "rose",
      "sun",
      "table",
      "violet",
      "whale",
      "yarn",
      "airplane",
      "bear",
      "cake",
      "desk",
      "guitar",
      "igloo",
      "juice",
      "kangaroo",
      "lamp",
      "mango",
      "nail",
      "piano",
      "rat",
      "tiger",
      "violin",
      "watermelon",
      "yacht",
    ];

    const word = words[Math.floor(Math.random() * words.length)];
    return word;
  };

  let randomWord = getRandomWord();

  const handleKeyDown = (event) => {
    if (event.key === " ") {
      setInputValue(randomWord);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase().replace(/[^a-z]/g, "");
    setInputValue(value);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="guessForm_container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(inputValue);
          setInputValue("");
        }}
      >
        <input
          className="guessForm"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          // onKeyDown={handleKeyDown} Feels like cheating is user spams spacebar
          placeholder={`type a word like '${isClient ? randomWord : "banana"}'`}
        />
      </form>
    </div>
  );
};

export default Input;
