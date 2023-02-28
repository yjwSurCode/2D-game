import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import "./index.less";

const renderTime = ({ remainingTime }: any) => {
  const currentTime = useRef(remainingTime);
  const prevTime = useRef(null);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  // force one last re-render when the time is over to tirgger the last animation
  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={`time ${!isTimeUp ? "down" : ""}`}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

export default function App(props: any) {
  const { style, className, children, countCount, ...rest } = props;
  const { width, ...restStyle } = style;

  const onComplete = () => {
    props.onComplete();
  };

  return (
    <div
      className="timer-wrapper"
      style={{
        ...restStyle,
        width,
      }}
      //   className={className}
    >
      {countCount !== 0 && (
        <CountdownCircleTimer
          isPlaying
          duration={countCount}
          colors={["#e5bd38", "#e5bd38", "#a91313", "#ff0000"]}
          // colors={["#44ff00", "#29b007", "#a91313", "#ff0000"]}
          colorsTime={[10, 6, 3, 0]}
          onComplete={onComplete}
        >
          {renderTime}
        </CountdownCircleTimer>
      )}
    </div>
  );
}
