const LevelSelectorButton = (
  { level, handleClick, isHighlighted, isComplete },
) => {
  return (
    <div
      className={`levelSelectorButton_container ${
        isHighlighted ? "highlighted" : ""
      } ${isComplete ? "green" : ""}`}
      onClick={handleClick}
    >
      <span className={level === "?" ? "random" : ""}>#{level}</span>
    </div>
  );
};

export default LevelSelectorButton;
