const LevelSelectorModal = ({ levels, handleLevelClick, handleClose }) => {
  return (
    <div className="levelSelectorModal_backdrop" onClick={handleClose}>
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
              onClick={() => {
                handleLevelClick(level);
              }}
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
export default LevelSelectorModal;
