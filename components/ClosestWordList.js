import GuessList from "./GuessList";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import React from "react";

const ClosestWordList = ({ words, handleClose, isLoading, guesses }) => {
  return (
    <div className="closestWordList_backdrop" onClick={handleClose}>
      <div className="modal_wrapper">
        <div className="modal_closeButton" />
        <div
          className="closestWordList_container"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {isLoading ? (
            <Skeleton
              count={17}
              height={27}
              baseColor="#b7b7b75e"
              className="skeleton"
              containerClassName="skeleton_container"
              duration={0.5}
            />
          ) : (
            <GuessList guesses={words} highlightedWords={guesses} size="sm" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClosestWordList;
