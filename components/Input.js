import { useState, useEffect } from "react";

const Input = ({ handleSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const [placeholder, setPlaceholder] = useState("banana");

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

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase().replace(/[^a-z]/g, "");
    setInputValue(value);
  };

  useEffect(() => {
    setPlaceholder(getRandomWord());
  }, [inputValue]);

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
          placeholder={`type a word like '${placeholder}'`}
        />
      </form>
    </div>
  );
};

export default Input;
