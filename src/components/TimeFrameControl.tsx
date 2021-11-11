import { FC } from "react";

export const timeFrames = ["5m", "1h", "24h", "7d", "30d", "all"] as const;
export type TimeFrame = typeof timeFrames[number];

export const displayTimeFrameMap: Record<TimeFrame, string> = {
  "5m": "5m",
  "1h": "1h",
  "24h": "1d",
  "7d": "7d",
  "30d": "30d",
  all: "all",
};

type Props = {
  selectedTimeframe: TimeFrame;
  onSetFeePeriod: (timeframe: TimeFrame) => void;
};

const TimeFrameControl: FC<Props> = ({ selectedTimeframe, onSetFeePeriod }) => {
  const activePeriodClasses =
    "text-white border-blue-highlightborder rounded-sm bg-blue-highlightbg";

  return (
    <div className="flex flex-row items-center lg:gap-x-2">
      {timeFrames.map((timeFrame) => (
        <button
          key={timeFrame}
          className={`font-roboto font-extralight text-sm lg:text-lg px-3 py-1 border border-transparent ${
            selectedTimeframe === timeFrame
              ? activePeriodClasses
              : "text-blue-spindle"
          }`}
          onClick={() => onSetFeePeriod(timeFrame)}
        >
          {displayTimeFrameMap[timeFrame]}
        </button>
      ))}
    </div>
  );
};

export default TimeFrameControl;
