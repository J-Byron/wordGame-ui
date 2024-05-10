import animationData from "public/lottie/confetti1.json";
import { Lottie } from "@crello/react-lottie";

const Confetti = ({ toggle }) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{ zIndex: "999", position: "absolute", pointerEvents: "none" }}>
      <Lottie
        key={toggle}
        config={defaultOptions}
        height={600}
        width={400}
        isClickToPauseDisabled={true}
      />
    </div>
  );
};

export default Confetti;
