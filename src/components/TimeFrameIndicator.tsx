import { differenceInDays } from "date-fns";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { londonHardFork } from "../dates";
import { millisFromHours } from "../duration";
import type { TimeFrameNext } from "../time-frames";
import { displayTimeFrameNextMap } from "../time-frames";
import { WidgetTitle } from "./WidgetSubcomponents";

const getFormattedDays = (now: Date) => {
  const daysCount = differenceInDays(now, londonHardFork);
  return `${daysCount}d`;
};

type Props = {
  className?: string;
  onClickTimeFrame: () => void;
  timeFrame: TimeFrameNext;
};

const TimeFrameIndicator: FC<Props> = ({
  className = "",
  onClickTimeFrame,
  timeFrame,
}) => {
  const [daysSinceLondon, setDaysSinceLondon] = useState<string>();

  useEffect(() => {
    setDaysSinceLondon(getFormattedDays(new Date()));

    const id = setTimeout(() => {
      setDaysSinceLondon(getFormattedDays(new Date()));
    }, millisFromHours(1));

    return () => clearTimeout(id);
  }, []);

  return (
    <button
      className={`flex items-baseline gap-x-2 ${className}`}
      onClick={onClickTimeFrame}
    >
      <WidgetTitle>time frame</WidgetTitle>
      <p className="font-roboto text-xs font-light text-white">
        {timeFrame === "all"
          ? daysSinceLondon
          : displayTimeFrameNextMap[timeFrame]}
      </p>
    </button>
  );
};

export default TimeFrameIndicator;
