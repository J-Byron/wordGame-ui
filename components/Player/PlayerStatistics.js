import { useState, useEffect } from "react";
import useMeasure from "react-use-measure";
import { useSpring, animated } from "@react-spring/web";
import PlayerLabel from "./PlayerLabel";

const PlayerStatistics = ({ player, statistics, isCurrentPlayer }) => {
  if (!statistics) return null;

  const { guesses: totalGuesses, green, yellow, red } = statistics;

  const COLORS = {
    green: { name: "green", value: "#12CC91" },
    yellow: { name: "yellow", value: "#EDCD1D" },
    red: { name: "red", value: "#FF4F79" },
  };

  const [greenRef, { width: greenWidth }] = useMeasure();
  const [yellowRef, { width: yellowWidth }] = useMeasure();
  const [redRef, { width: redWidth }] = useMeasure();
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  const calculateWidthAndColor = (colorName, numberOfGuesses) => {
    const percentage = numberOfGuesses / totalGuesses;
    let width;

    if (colorName == COLORS.green.name) width = greenWidth;
    if (colorName == COLORS.yellow.name) width = yellowWidth;
    if (colorName == COLORS.red.name) width = redWidth;

    return {
      width: didMount ? width * percentage : 0,
      backgroundColor: didMount ? COLORS[colorName].value : "#FF4F79",
    };
  };

  const greenProps = useSpring({
    pos: didMount ? green : 0,
    config: { tension: 40, friction: 12 },
    ...calculateWidthAndColor(COLORS.green.name, green),
  });
  const yellowProps = useSpring({
    pos: didMount ? yellow : 0,
    config: { tension: 40, friction: 12 },
    ...calculateWidthAndColor(COLORS.yellow.name, yellow),
  });

  const redProps = useSpring({
    pos: didMount ? red : 0,
    config: { tension: 40, friction: 12 },
    ...calculateWidthAndColor(COLORS.red.name, red),
  });

  return (
    <div className="playerStats_container">
      <div className="playerStats_header">
        <PlayerLabel player={player} isCurrentPlayer={isCurrentPlayer} />
        <div className="playerStats_guesses">{totalGuesses} guesses</div>
      </div>
      <div>
        {/* GREEN */}
        <div ref={greenRef} className={`playerStatsCell_container`}>
          <div className={`playerStatsCell`}>
            <animated.div className="playerStatsCell_fill" style={greenProps} />
            <span className="playerStatsCell_text">
              <animated.div className="playerStatsCell_pos">{greenProps.pos.to((x) => x.toFixed(0))}</animated.div>
              &nbsp;{`/ ${totalGuesses}`}
            </span>
          </div>
        </div>
        {/* YELLOW */}
        <div ref={yellowRef} className={`playerStatsCell_container`}>
          <div className={`playerStatsCell`}>
            <animated.div className="playerStatsCell_fill" style={yellowProps} />
            <span className="playerStatsCell_text">
              <animated.div className="playerStatsCell_pos">{yellowProps.pos.to((x) => x.toFixed(0))}</animated.div>
              &nbsp;{`/ ${totalGuesses}`}
            </span>
          </div>
        </div>
        {/* RED */}
        <div ref={redRef} className={`playerStatsCell_container`}>
          <div className={`playerStatsCell`}>
            <animated.div className="playerStatsCell_fill" style={redProps} />
            <span className="playerStatsCell_text">
              <animated.div className="playerStatsCell_pos">{redProps.pos.to((x) => x.toFixed(0))}</animated.div>
              &nbsp;{`/ ${totalGuesses}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatistics;
