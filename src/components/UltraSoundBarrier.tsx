import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";
import barrierSvg from "../assets/barrier-own.svg";
import batSvg from "../assets/bat-own.svg";
import speakerSvg from "../assets/speaker-own.svg";

const UltraSoundBarrier: FC = () => (
  <div className="inline-flex gap-x-1">
    <div className="h-4 w-4">
      <Image alt="bat emoji" src={batSvg as StaticImageData} />
    </div>
    <div className="h-4 w-4">
      <Image alt="speaker emoji" src={speakerSvg as StaticImageData} />
    </div>
    <div className="h-4 w-4">
      <Image alt="barrier emoji" src={barrierSvg as StaticImageData} />
    </div>
  </div>
);

export default UltraSoundBarrier;
