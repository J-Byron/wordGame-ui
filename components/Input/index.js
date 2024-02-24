import { useState } from "react";

const Input = ({ handleSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase().replace(/[^a-z]/g, "");
    setInputValue(value);
  };

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
        />
      </form>
    </div>
  );
};

export default Input;
