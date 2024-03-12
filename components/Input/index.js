import { useState, useEffect } from "react";

const Input = ({ handleSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const [isClient, setIsClient] = useState(false); // run dynamic unpredictable code on client only

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase().replace(/[^a-z]/g, "");
    setInputValue(value);
  };

  const randomWord = () => {
    const words = ["banana", "tree", "iguana", "bird", "fireplace"];
    const word = words[Math.floor(Math.random() * words.length)];
    return word;
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
          // isClient ? 'never pre-rendereed' : 'always pre-rendered'
          placeholder={`type a word like ${isClient ? randomWord() : "banana"}`} // Eventually needs to be clickable
        />
      </form>
    </div>
  );
};

export default Input;
