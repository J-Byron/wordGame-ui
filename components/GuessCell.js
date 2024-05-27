import { useState, useEffect } from "react";
import useMeasure from "react-use-measure";
import { useSpring, animated } from "@react-spring/web";

const GuessCell = ({ guess, isHighlighted = false, size = "md" }) => {
  if (guess == null) return null;

  const { word, pos } = guess;

  const [didMount, toggle] = useState(false);
  const [ref, { width }] = useMeasure();

  //   $color-red: #FF4F79;
  // $color-green: #12CC91;
  // $color-yellow: #EDCD1D;

  // Function to calculate width percentage based on distance
  const calculateWidthAndColor = () => {
    const maxDistance = 3000;
    const percentage = 1 - pos / maxDistance;
    const exponentialFactor = 2; // Adjust this factor to control the rate of increase

    const bgColor = (pos) => {
      switch (true) {
        case pos < maxDistance && pos >= 200:
          return "#EDCD1D";
        case pos < 200:
          return "#12CC91";
        default:
          return "#FF4F79";
      }
    };

    return {
      width: didMount ? Math.max(width * Math.pow(Math.max(percentage, 0.05), exponentialFactor), width * 0.05) : 0,
      backgroundColor: didMount ? bgColor(pos) : "#FF4F79",
    };
  };

  const props = useSpring({
    pos: didMount ? pos : 0,
    config: { tension: 40, friction: 12 },
    ...calculateWidthAndColor(),
  });

  useEffect(() => {
    toggle(true);
  }, []);

  return (
    <div ref={ref} className={`guessCell_container ${isHighlighted ? "highlighted" : ""} ${size}`}>
      <div className={`guessCell ${size}`}>
        <span className="guessCell_word">{word}</span>

        {/* Loader */}
        <animated.div className="guessCell_fill" style={props} />

        {/* Pos counter */}
        <animated.div className="guessCell_pos">{props.pos.to((x) => x.toFixed(0))}</animated.div>
      </div>
    </div>
  );
};

export default GuessCell;
