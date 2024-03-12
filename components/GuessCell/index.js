import { useState, useEffect } from "react";
import useMeasure from "react-use-measure";
import { useSpring, animated } from "@react-spring/web";

const GuessCell = ({ guess }) => {
  if (guess == null) return null;

  const { word, pos } = guess;

  const [didMount, toggle] = useState(false);
  const [ref, { width }] = useMeasure();

  //   $color-red: #FF4F79;
  // $color-green: #12CC91;
  // $color-yellow: #EDCD1D;

  // Function to calculate width percentage based on distance
  const calculateWidthAndColor = () => {
    const maxDistance = 2000;
    const percentage = 1 - pos / maxDistance;

    if (pos >= 2000) {
      // RED
      return {
        width: didMount ? width * 0.05 : 0,
        backgroundColor: "#FF4F79",
      };
    } else if (pos < 2000 && pos >= 200) {
      // YELLOW
      return {
        width: didMount ? width * Math.max(percentage, 0.05) : 0,
        backgroundColor: didMount ? "#EDCD1D" : "#FF4F79",
      };
    } else {
      // GREEN
      return {
        width: didMount ? width * Math.max(percentage, 0.05) : 0,
        backgroundColor: didMount ? "#12CC91" : "#FF4F79",
      };
    }
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
    <div ref={ref} className="guessCell_container">
      <div className="guessCell">
        <span className="guessCell_word">{word}</span>

        {/* Loader */}
        <animated.div className="guessCell_fill" style={props} />

        {/* Pos counter */}
        <animated.div className="guessCell_pos">
          {props.pos.to((x) => x.toFixed(0))}
        </animated.div>
      </div>
    </div>
  );
};

export default GuessCell;
