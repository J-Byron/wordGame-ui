import GuessList from "./GuessList";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import React from "react";

const ClosestWordList = ({ words, handleClose, isLoading }) => {
  return (
    <div className="closestWordList_backdrop" onClick={handleClose}>
      <div
        className="closestWordList_container"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {isLoading ? (
          <Skeleton
            count={12}
            height={38}
            baseColor="#b7b7b75e"
            className="skeleton"
            containerClassName="skeleton_container"
          />
        ) : (
          <GuessList guesses={words} size="sm" />
        )}
      </div>
    </div>
  );
};

export default ClosestWordList;
