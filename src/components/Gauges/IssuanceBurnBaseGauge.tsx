import CountUp from "react-countup";
import { FC, memo } from "react";
import GaugeSvg from "./GaugeSvg";
import colors from "../../colors";

type BaseGuageProps = {
  title: string;
  value: number;
  valueFillColor?: string;
  needleColor?: string;
};

const BaseGuage: FC<BaseGuageProps> = ({
  title,
  value,
  valueFillColor = colors.spindle,
  needleColor,
}) => {
  const min = 0;
  const max = 12;

  return (
    <>
      <div className="relative transform md:scale-gauge-md md:-mt-12 lg:-mt-2 lg:scale-100">
        <GaugeSvg
          progress={value / (max - min)}
          progressFillColor={valueFillColor}
          needleColor={needleColor}
        />
        <span className="absolute left-8 top-44 font-roboto font-light text-white">
          {min}Ξ
        </span>
        <span className="absolute right-6 top-44 font-roboto font-light text-white">
          {max}Ξ
        </span>
      </div>
      <p className="relative font-roboto font-light text-white text-center text-lg -mt-24">
        <CountUp
          decimals={2}
          duration={1}
          separator=","
          end={value}
          preserveValue={true}
          suffix="M"
        />
      </p>
      <span className="relative font-extralight text-blue-spindle -mt-1">
        ETH/year
      </span>
      <p className="relative font-inter font-light uppercase text-blue-spindle text-md text-center mt-4">
        {title}
      </p>
    </>
  );
};

export default memo(BaseGuage);
