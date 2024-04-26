export const LevelSelectorModal = ({
  levels,
  show,
  handleLevelClick,
  handleOutsideClick,
}) => {
  // TODO levels should be [{level: string, isComplete: bool}]
  return (
    <div
      className="levelSelectorModal_backdrop"
      style={{ display: `${show ? " " : "none "}` }}
      onClick={handleOutsideClick}
    >
      <div
        className="levelSelectorModal_container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {[{ level: "?" }, ...levels].map(({ level, isComplete }, index) => {
          return (
            <div
              className={`levelSelectorModal_cell ${isComplete ? "green" : ""}`}
              onClick={() => handleLevelClick(level)}
              key={index}
            >
              <span>Level</span>
              <span className={index == 0 ? "random" : ""}>{level}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
